import {
  ChevronLeft,
  ChevronRight,
  Heart,
  CalendarDays,
  Radio,
} from "lucide-react";
import { MatchCard } from "./MatchCard";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const mockMatches = [
  {
    id: "1",
    homeTeam: { id: "1", name: "Arsenal", logo: "", shortName: "ARS" },
    awayTeam: { id: "2", name: "Valencia", logo: "", shortName: "VAL" },
    homeScore: 2,
    awayScore: 1,
    status: "finished" as const,
    date: "2024-01-11",
    league: "UEFA Champions League",
  },
  {
    id: "2",
    homeTeam: { id: "3", name: "Real Madrid", logo: "", shortName: "RMA" },
    awayTeam: { id: "4", name: "Leicester City", logo: "", shortName: "LEI" },
    homeScore: 1,
    awayScore: 3,
    status: "finished" as const,
    date: "2024-01-11",
    league: "UEFA Champions League",
  },
  {
    id: "3",
    homeTeam: { id: "1", name: "Arsenal", logo: "", shortName: "ARS" },
    awayTeam: { id: "5", name: "Manchester City", logo: "", shortName: "MCI" },
    homeScore: 4,
    awayScore: 1,
    status: "live" as const,
    date: "2024-01-11",
    league: "English Premier League",
  },
  {
    id: "4",
    homeTeam: { id: "6", name: "Newcastle United", logo: "", shortName: "NEW" },
    awayTeam: { id: "7", name: "Liverpool", logo: "", shortName: "LIV" },
    homeScore: 0,
    awayScore: 1,
    status: "live" as const,
    date: "2024-01-11",
    league: "English Premier League",
  },
  {
    id: "5",
    homeTeam: { id: "8", name: "Burnley", logo: "", shortName: "BUR" },
    awayTeam: { id: "5", name: "Manchester City", logo: "", shortName: "MCI" },
    homeScore: 0,
    awayScore: 0,
    status: "scheduled" as const,
    date: "2024-01-11",
    time: "23:00",
    league: "English Premier League",
  },
  {
    id: "6",
    homeTeam: { id: "9", name: "Chelsea", logo: "", shortName: "CHE" },
    awayTeam: { id: "10", name: "Southampton", logo: "", shortName: "SOU" },
    homeScore: 0,
    awayScore: 0,
    status: "scheduled" as const,
    date: "2024-01-11",
    time: "23:00",
    league: "English Premier League",
  },
];

export function Fixtures() {
  const navigate = useNavigate();
  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="hidden md:block text-2xl font-bold mb-8">Matches</h1>

        <div className="hidden md:flex items-center justify-between gap-4 mb-8 bg-muted py-4 rounded-lg px-4">
          <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            <span className="font-medium">Today</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
        </div>

        <div className="md:hidden flex justify-between items-center mb-6 text-sm px-8 text-center">
          <span className="text-gray-600">WED 30 AUG</span>
          <span className="text-gray-400">THU 31 JUL</span>
          <span className="text-primary font-medium backdrop-blur bg-primary/20 px-3 py-2 rounded-lg">
            Today 1 AUG
          </span>
          <span className="text-gray-400">SAT 2 AUG</span>
          <span className="text-gray-600">SUN 3 AUG</span>
          <CalendarDays className="w-8 h-8 text-primary" />
        </div>

        <div className="flex justify-start gap-4 mb-8">
          <div className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg text-sm font-medium">
            <span>All</span>
            <Badge className="bg-black text-white text-xs">9</Badge>
          </div>
          <div className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
            <Radio className="w-4 h-4" />
            <span>Live</span>
            <Badge className="bg-gray-600 text-white text-xs">4</Badge>
          </div>
          <div className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
            <Heart className="w-4 h-4" />
            <span>Favorites</span>
            <Badge className="bg-gray-600 text-white text-xs">2</Badge>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-muted px-6 py-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">UEFA Champions League</h2>
              <ChevronRight
                className="w-5 h-5 text-gray-400"
                onClick={() => {
                  navigate("/match/dgfefds");
                }}
              />
            </div>
            <div className="space-y-3">
              {mockMatches
                .filter((m) => m.league === "UEFA Champions League")
                .map((match) => (
                  <div key={match.id} className="">
                    <MatchCard match={match} />
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-muted px-6 py-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">English Premier League</h2>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockMatches
                .filter((m) => m.league === "English Premier League")
                .map((match) => (
                  <div key={match.id} className="">
                    <MatchCard
                      match={match}
                      showTime={match.status === "scheduled"}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
