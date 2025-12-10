import type { Match } from "@/types";
import { MoreVertical } from "lucide-react";

interface MatchCardProps {
  match: Match;
  showTime?: boolean;
}

export function MatchCard({ match, showTime = false }: MatchCardProps) {
  const getStatusBadge = () => {
    switch (match.status) {
      case "live":
        return <span className="px-2 py-1 text-primary">LIVE</span>;
      case "finished":
        return <span className="px-2 py-1 text-destructive">FT</span>;
      default:
        return showTime && match.time ? (
          <span className="text-gray-400 text-sm">{match.time}</span>
        ) : null;
    }
  };

  return (
    <div className="bg-muted  p-4 hover:bg-gray-750 transition-colors border-l-4 border-red-500 border-b border-b-muted-foreground">
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2 min-w-[60px]">
            {getStatusBadge()}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <span className="text-white text-sm">
                  {match.homeTeam.name}
                </span>
              </div>
              <span className="text-white font-bold">{match.homeScore}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
                <span className="text-white text-sm">
                  {match.awayTeam.name}
                </span>
              </div>
              <span className="text-white font-bold">{match.awayScore}</span>
            </div>
          </div>
        </div>

        <MoreVertical className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
      </div>
    </div>
  );
}
