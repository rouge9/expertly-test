import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import type { MatchCardProps } from "@/types/match.types";

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
    <div
      className={cn(
        "bg-muted p-4 hover:bg-gray-750 transition-colors border-b border-b-muted-foreground relative",
        match.status === "finished"
          ? "border-l-4 border-l-red-500 shadow-[inset_8px_0_12px_-8px_rgba(239,68,68,0.3)]"
          : match.status === "live"
          ? "border-l-4 border-l-primary shadow-[inset_8px_0_12px_-8px_rgba(var(--primary),0.3)]"
          : "border-l-4 border-l-muted-foreground"
      )}
    >
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2 min-w-[60px]">
            {getStatusBadge()}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                  />
                  <AvatarFallback>
                    <span className="text-white text-xs font-bold">
                      {match.homeTeam.name.slice(0, 2)}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm">
                  {match.homeTeam.name}
                </span>
              </div>
              <span className="text-white font-bold">{match.homeScore}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                  />
                  <AvatarFallback>
                    <span className="text-white text-xs font-bold">
                      {match.homeTeam.name.slice(0, 2)}
                    </span>
                  </AvatarFallback>
                </Avatar>
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
