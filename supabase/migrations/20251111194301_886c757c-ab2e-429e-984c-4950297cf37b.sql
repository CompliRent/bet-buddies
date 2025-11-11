-- Create enum for league member roles
CREATE TYPE public.league_role AS ENUM ('owner', 'admin', 'member');

-- Create leagues table
CREATE TABLE public.leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_private BOOLEAN NOT NULL DEFAULT false,
  max_members INTEGER DEFAULT 50,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create league_members table
CREATE TABLE public.league_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.league_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(league_id, user_id)
);

-- Enable RLS
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leagues table
CREATE POLICY "Everyone can view public leagues"
  ON public.leagues FOR SELECT
  USING (is_private = false OR created_by = auth.uid());

CREATE POLICY "Members can view their private leagues"
  ON public.leagues FOR SELECT
  USING (
    is_private = true AND 
    EXISTS (
      SELECT 1 FROM public.league_members 
      WHERE league_members.league_id = leagues.id 
      AND league_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create leagues"
  ON public.leagues FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "League owners can update their leagues"
  ON public.leagues FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "League owners can delete their leagues"
  ON public.leagues FOR DELETE
  USING (created_by = auth.uid());

-- RLS Policies for league_members table
CREATE POLICY "Users can view league members of leagues they're in"
  ON public.league_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.league_members AS lm 
      WHERE lm.league_id = league_members.league_id 
      AND lm.user_id = auth.uid()
    )
  );

CREATE POLICY "League owners and admins can add members"
  ON public.league_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.league_members 
      WHERE league_id = league_members.league_id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    ) OR 
    user_id = auth.uid()
  );

CREATE POLICY "League owners and admins can update members"
  ON public.league_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.league_members AS lm
      WHERE lm.league_id = league_members.league_id 
      AND lm.user_id = auth.uid() 
      AND lm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can leave leagues and owners can remove members"
  ON public.league_members FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.league_members AS lm
      WHERE lm.league_id = league_members.league_id 
      AND lm.user_id = auth.uid() 
      AND lm.role IN ('owner', 'admin')
    )
  );

-- Add trigger for updated_at on leagues
CREATE TRIGGER update_leagues_updated_at
  BEFORE UPDATE ON public.leagues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically add creator as owner when league is created
CREATE OR REPLACE FUNCTION public.handle_new_league()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.league_members (league_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner');
  RETURN NEW;
END;
$$;

-- Trigger to add creator as owner
CREATE TRIGGER on_league_created
  AFTER INSERT ON public.leagues
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_league();

-- Create indexes for better performance
CREATE INDEX idx_leagues_created_by ON public.leagues(created_by);
CREATE INDEX idx_league_members_league_id ON public.league_members(league_id);
CREATE INDEX idx_league_members_user_id ON public.league_members(user_id);