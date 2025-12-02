import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

interface BetSelection {
  eventId: string;
  teamId: string;
  line: number;
  homeTeamId: string;
  awayTeamId: string;
}

const Betting = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selections, setSelections] = useState<Record<string, BetSelection>>({});

  // Fetch league info
  const { data: league } = useQuery({
    queryKey: ["league", leagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leagues")
        .select("*")
        .eq("id", leagueId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!leagueId,
  });

  // Fetch upcoming events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_events")
        .select("*")
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Check for existing card this week
  const { data: existingCard } = useQuery({
    queryKey: ["user-card", leagueId, user?.id],
    queryFn: async () => {
      if (!user?.id || !leagueId) return null;
      const currentWeek = getWeekNumber();
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .eq("league_id", leagueId)
        .eq("week_number", currentWeek)
        .eq("season_year", new Date().getFullYear())
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!leagueId,
  });

  // Submit card mutation
  const submitCardMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !leagueId) throw new Error("Not authenticated");

      const currentWeek = getWeekNumber();
      const betsArray = Object.values(selections);

      if (betsArray.length === 0) {
        throw new Error("Please select at least one pick");
      }

      // Create the card
      const { data: card, error: cardError } = await supabase
        .from("cards")
        .insert({
          user_id: user.id,
          league_id: leagueId,
          week_number: currentWeek,
          season_year: new Date().getFullYear(),
        })
        .select()
        .single();

      if (cardError) throw cardError;

      // Create the bets
      const betsToInsert = betsArray.map((bet) => ({
        card_id: card.id,
        event_id: bet.eventId,
        selected_team_id: bet.teamId,
        home_team_id: bet.homeTeamId,
        away_team_id: bet.awayTeamId,
        line: bet.line,
      }));

      const { error: betsError } = await supabase
        .from("bets")
        .insert(betsToInsert);

      if (betsError) throw betsError;

      return card;
    },
    onSuccess: () => {
      toast({
        title: "Card Submitted!",
        description: "Your picks have been locked in for this week.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-card"] });
      navigate(`/leagues/${leagueId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit card",
        variant: "destructive",
      });
    },
  });

  const handleSelectTeam = (eventId: string, teamId: string, line: number) => {
    const event = events?.find((e) => e.event_id === eventId);
    if (!event) return;

    setSelections((prev) => {
      const existing = prev[eventId];
      // If clicking the same team, deselect
      if (existing?.teamId === teamId) {
        const { [eventId]: _, ...rest } = prev;
        return rest;
      }
      // Otherwise, select this team
      return {
        ...prev,
        [eventId]: {
          eventId,
          teamId,
          line,
          homeTeamId: event.home_team_id,
          awayTeamId: event.away_team_id,
        },
      };
    });
  };

  const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000;
    return Math.ceil(diff / oneWeek);
  };

  const selectionCount = Object.keys(selections).length;

  if (existingCard) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Link to={`/leagues/${leagueId}`}>
            <Button variant="ghost" size="sm" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to League
            </Button>
          </Link>
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Card Already Submitted</h2>
              <p className="text-muted-foreground">
                You've already submitted your picks for this week. Check back next week!
              </p>
              <Button className="mt-6" onClick={() => navigate(`/leagues/${leagueId}`)}>
                View Leaderboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="border-b border-border/40 bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <Link to={`/leagues/${leagueId}`}>
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to {league?.name || "League"}
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Make Your Picks</h1>
              <p className="text-muted-foreground mt-2">
                Select the winners for this week's games
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {selectionCount} picks
            </Badge>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {eventsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  selectedTeam={selections[event.event_id]?.teamId || null}
                  onSelectTeam={handleSelectTeam}
                />
              ))}
            </div>

            <Card className="sticky bottom-4 border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {selectionCount} {selectionCount === 1 ? "pick" : "picks"} selected
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Submit your card to lock in your picks
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => submitCardMutation.mutate()}
                    disabled={selectionCount === 0 || submitCardMutation.isPending}
                  >
                    {submitCardMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Card"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Upcoming Games</CardTitle>
              <CardDescription>
                There are no games available for betting right now. Check back later!
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Betting;
