import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Ticket, Trophy, Calendar, Target, Star } from "lucide-react";

const HowToPlay = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              How to Play BetBuddies
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compete with friends by picking NFL game outcomes. No real money involved — just bragging rights and fun!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Step 1 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">1. Join or Create a League</CardTitle>
                    <CardDescription>Get started with friends</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create your own league and invite friends with a unique code, or join an existing league. 
                  Public leagues are open to everyone, while private leagues require an invite code.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Ticket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">2. Make Your Picks</CardTitle>
                    <CardDescription>Choose up to 5 bets per week</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Each week, select up to 5 bets from available NFL games. Choose from three bet types:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li><strong>Moneyline (ML):</strong> Pick the winning team</li>
                  <li><strong>Spread (SPR):</strong> Pick a team to cover the point spread</li>
                  <li><strong>Over/Under (O/U):</strong> Pick if total points go over or under</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">3. Lock In Before Kickoff</CardTitle>
                    <CardDescription>Picks lock when games start</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You can edit your picks anytime before a game starts. Once a game kicks off, 
                  that pick is locked and cannot be changed. Plan ahead and get your picks in early!
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">4. Earn Points</CardTitle>
                    <CardDescription>Score based on betting odds</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Winning picks earn points based on the odds. Underdog picks (+odds) earn more points 
                  than favorite picks (-odds). Losing picks earn 0 points, and missing picks cost you 20 points each.
                </p>
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">5. Climb the Leaderboard</CardTitle>
                    <CardDescription>Compete for weekly and all-time glory</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See how you stack up against league members on the weekly leaderboard. 
                  Weekly rankings also contribute to your all-time score — top finishes each week earn bonus points!
                </p>
              </CardContent>
            </Card>

            {/* Step 6 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">6. Have Fun!</CardTitle>
                    <CardDescription>It is all about the competition</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  BetBuddies is all about friendly competition. Talk trash, celebrate wins, 
                  and enjoy the NFL season with your friends. No real money, just fun!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-4">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;