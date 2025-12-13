import { Heart, HeartOff, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import type { MatchCardProps } from "@/types/match.types";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";

export function MatchCard({
  match,
  showTime = false,
  onFavoriteChange,
}: MatchCardProps) {
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(match.id));
  }, [match.id]);

  const handleClick = () => {
    navigate(`/match/${match.id}`);
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((id: string) => id !== match.id);
    } else {
      updatedFavorites = [...favorites, match.id];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    onFavoriteChange?.();
  };

  const getStatusBadge = () => {
    switch (match.status) {
      case "live":
        return (
          <div className="relative overflow-hidden">
            <span className="px-2 py-1 text-primary text-sm">LIVE</span>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary/20">
              <div className="h-full w-4 bg-primary animate-[slide_2s_ease-in-out_infinite]" />
            </div>
          </div>
        );
      case "finished":
        return <span className="px-2 py-1 text-destructive">FT</span>;
      default:
        return showTime && match.time ? (
          <span className="text-gray-400 text-sm">
            {match.time.slice(0, 5)}
          </span>
        ) : null;
    }
  };

  return (
    <div
      className={cn(
        "bg-muted p-4 hover:bg-muted-foreground/20 transition-colors border-b border-b-muted-foreground relative cursor-pointer",
        match.status === "finished"
          ? "border-l-4 border-l-red-500 shadow-[inset_8px_0_12px_-8px_rgba(239,68,68,0.3)]"
          : match.status === "live"
          ? "border-l-4 border-l-primary shadow-[inset_8px_0_12px_-8px_rgba(var(--primary),0.3)]"
          : "border-l-4 border-l-muted-foreground"
      )}
    >
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-3 flex-1" onClick={handleClick}>
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
              <span className="text-white font-bold">
                {match?.status !== "scheduled" && match.homeScore}
              </span>
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
              <span className="text-white font-bold">
                {match?.status !== "scheduled" && match.awayScore}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleFavorite}>
              {isFavorite ? (
                <>
                  <HeartOff className="w-4 h-4" />
                  Remove from Favorites
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  Add to Favorites
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
