import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EventTimeline from "./EventTimeline";

export function MatchDetails() {
  const mockEvents = [
    {
      time: "89'",
      eventType: "pass",
      awayPlayer: "Gyakores",
      awayTeam: "Arsenal",
    },
    {
      time: "88'",
      eventType: "substitution",
      homePlayer: "Eklilke",
      homeStatus: "Sallah",
      homeTeam: "Liverpool",
    },
    {
      time: "78'",
      eventType: "card",
      card: "yellow",
      awayPlayer: "Saliba",
      awayTeam: "Arsenal",
    },
    { time: "74'" },
    {
      time: "67'",
      eventType: "pass",
      awayPlayer: "Rice",
      awayTeam: "Arsenal",
    },
    {
      time: "66'",
      eventType: "card",
      card: "red",
      homePlayer: "Van Dijk",
      homeTeam: "Liverpool",
    },
    {
      time: "55'",
      eventType: "substitution",
      awayPlayer: "Saka",
      awayTeam: "Arsenal",
    },
    { time: "52'", eventType: "corner", awayPlayer: "5th corner" },
    { time: "48'", eventType: "corner", homePlayer: "3rd Corner" },
  ];
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-muted px-6 pt-6 rounded-lg">
          <div
            className="flex items-center gap-3 mb-6"
            onClick={() => {
              window.history.back();
            }}
          >
            <ArrowLeft className="w-5 h-5 cursor-pointer hover:text-green-400" />
            <span className="text-gray-300">English Premier league</span>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center lg:gap-28 gap-8 mb-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div className="text-yellow-400 text-xs mb-1">⚠️</div>
                <span className="text-white font-medium">Arsenal</span>
              </div>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">11 AUG</div>
                <div className="lg:text-4xl text-xl font-bold mb-2">2 - 1</div>
                <Badge variant="finished" className="text-xs">
                  Finished
                </Badge>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <div className="text-red-500 text-xs mb-1">🔴</div>
                <span className="text-white font-medium">Liverpool</span>
              </div>
            </div>
          </div>

          <nav className="flex justify-center gap-8 mb-8 overflow-hidden">
            <a href="#" className="pb-3 text-gray-400 hover:text-white">
              Details
            </a>
            <a href="#" className="pb-3 text-gray-400 hover:text-white">
              Odds
            </a>
            <a href="#" className="pb-3 text-gray-400 hover:text-white">
              Lineups
            </a>
            <a href="#" className="pb-3  border-b-2 border-green-400">
              Events
            </a>
            <a href="#" className="pb-3 text-gray-400 hover:text-white">
              Stats
            </a>
            <a href="#" className="pb-3 text-gray-400 hover:text-white">
              Standings
            </a>
          </nav>
        </div>

        <div className="space-y-4 bg-muted rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Events</h3>
          <div className="flex flex-col justify-center items-center">
            <div className="text-center text-gray-400 text-sm mb-4">
              Fulltime 2 - 1
            </div>

            <EventTimeline events={mockEvents} />
          </div>
        </div>
      </div>
    </div>
  );
}
