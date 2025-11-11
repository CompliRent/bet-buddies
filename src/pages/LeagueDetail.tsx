import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Users, Calendar, Settings, DollarSign } from "lucide-react";

const LeagueDetail = () => {
  const { id } = useParams();

  // Mock league data
  const league = {
    id: id,
    name: "Weekend Warriors",
    description: "Competitive weekend betting league for NFL and NBA games",
    members: 12,
    created: "Jan 15, 2024",
    privacy: "Private",
    entryFee: "$20",
  };

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, username: "SportsFanatic", wins: 24, losses: 8, winRate: 75, points: 1240 },
    { rank: 2, username: "BetMaster99", wins: 22, losses: 10, winRate: 69, points: 1180 },
    { rank: 3, username: "LuckyStreak", wins: 20, losses: 12, winRate: 63, points: 1090 },
    { rank: 4, username: "GameDay", wins: 18, losses: 14, winRate: 56, points: 980 },
    { rank: 5, username: "ProPicker", wins: 17, losses: 15, winRate: 53, points: 920 },
    { rank: 6, username: "AllInAce", wins: 16, losses: 16, winRate: 50, points: 860 },
    { rank: 7, username: "WinnerCircle", wins: 15, losses: 17, winRate: 47, points: 810 },
    { rank: 8, username: "BetSmart", wins: 14, losses: 18, winRate: 44, points: 750 },
  ];

  // Mock recent bets data
  const recentBets = [
    {
      id: 1,
      username: "SportsFanatic",
      game: "Lakers vs Warriors",
      pick: "Lakers -5.5",
      amount: "$50",
      status: "won",
      time: "2 hours ago",
    },
    {
      id: 2,
      username: "BetMaster99",
      game: "Cowboys vs Eagles",
      pick: "Over 48.5",
      amount: "$30",
      status: "won",
      time: "3 hours ago",
    },
    {
      id: 3,
      username: "LuckyStreak",
      game: "Celtics vs Heat",
      pick: "Heat +3.5",
      amount: "$40",
      status: "lost",
      time: "5 hours ago",
    },
    {
      id: 4,
      username: "GameDay",
      game: "Chiefs vs Bills",
      pick: "Chiefs ML",
      amount: "$60",
      status: "pending",
      time: "1 day ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "lost":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="border-b border-border/40 bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <Link to="/leagues">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Leagues
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{league.name}</h1>
              <p className="text-muted-foreground mt-2">{league.description}</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* League Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="text-2xl font-bold">{league.members}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Entry Fee</p>
                  <p className="text-2xl font-bold">{league.entryFee}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-2xl font-bold">{league.created}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Privacy</p>
                  <p className="text-2xl font-bold">{league.privacy}</p>
                </div>
                <Trophy className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="bets">Recent Bets</TabsTrigger>
            <TabsTrigger value="info">League Info</TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Rankings</CardTitle>
                <CardDescription>Current standings for all league members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((member) => (
                    <div key={member.rank}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8">
                            {member.rank <= 3 ? (
                              <Trophy
                                className={`h-5 w-5 ${
                                  member.rank === 1
                                    ? "text-yellow-500"
                                    : member.rank === 2
                                    ? "text-gray-400"
                                    : "text-amber-600"
                                }`}
                              />
                            ) : (
                              <span className="text-sm font-medium text-muted-foreground">#{member.rank}</span>
                            )}
                          </div>
                          <Avatar>
                            <AvatarFallback>{member.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.wins}W - {member.losses}L
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Win Rate</p>
                            <div className="flex items-center gap-1">
                              {member.winRate >= 50 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                              <p className="font-semibold">{member.winRate}%</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Points</p>
                            <p className="font-bold text-lg">{member.points}</p>
                          </div>
                        </div>
                      </div>
                      {member.rank < leaderboard.length && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Bets Tab */}
          <TabsContent value="bets">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest bets placed by league members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBets.map((bet) => (
                    <div key={bet.id}>
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>{bet.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="font-medium">{bet.username}</p>
                            <p className="text-sm text-muted-foreground">{bet.game}</p>
                            <p className="text-sm">
                              <span className="text-foreground font-medium">{bet.pick}</span> · {bet.amount}
                            </p>
                            <p className="text-xs text-muted-foreground">{bet.time}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(bet.status)}>
                          {bet.status.toUpperCase()}
                        </Badge>
                      </div>
                      {bet.id < recentBets.length && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* League Info Tab */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>League Information</CardTitle>
                <CardDescription>Details and settings for this league</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{league.description}</p>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Entry Fee</h3>
                    <p className="text-muted-foreground">{league.entryFee} per member</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Privacy</h3>
                    <p className="text-muted-foreground">{league.privacy} league</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Created</h3>
                    <p className="text-muted-foreground">{league.created}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Total Members</h3>
                    <p className="text-muted-foreground">{league.members} active members</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Rules</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Minimum bet: $10</li>
                    <li>Maximum bet: $100</li>
                    <li>Bets must be placed 1 hour before game time</li>
                    <li>Weekly payout for top 3 members</li>
                  </ul>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    Invite Members
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Leave League
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LeagueDetail;
