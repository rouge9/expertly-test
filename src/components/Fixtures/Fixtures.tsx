import { Heart, Radio } from "lucide-react";
import { MatchCard } from "../match/MatchCard";
import { Badge } from "@/components/ui/badge";
import { DateSlider } from "./DateSlider";
import { Skeleton } from "../ui/skeleton";
import type { FixturesProps } from "@/types/match.types";
import { useLocation } from "react-router-dom";
import PageErrors from "../ErrorComponents/PageErrors";
import { useMemo, useState } from "react";

type FilterType = "all" | "live" | "favorites";

export function Fixtures({
  groupedMatches = {},
  loading = false,
  error = null,
  isLive = true,
  refetch,
}: FixturesProps) {
  const param = useLocation();
  const hasMatches = Object.keys(groupedMatches).length > 0;
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [favoritesUpdate, setFavoritesUpdate] = useState(0);

  const handleFavoritesChange = () => {
    setFavoritesUpdate((prev) => prev + 1);
  };

  const filteredMatches = useMemo(() => {
    if (activeFilter === "all") return groupedMatches;

    const filtered: typeof groupedMatches = {};
    Object.entries(groupedMatches).forEach(([league, matches]) => {
      const filteredLeagueMatches = matches.filter((match) => {
        if (activeFilter === "live") return match.status === "live";
        if (activeFilter === "favorites") {
          const favorites = JSON.parse(
            localStorage.getItem("favorites") || "[]"
          );
          return favorites.includes(match.id);
        }
        return true;
      });
      if (filteredLeagueMatches.length > 0) {
        filtered[league] = filteredLeagueMatches;
      }
    });
    return filtered;
  }, [groupedMatches, activeFilter, favoritesUpdate]);

  const allMatches = Object.values(groupedMatches).flat();
  const liveMatches = allMatches.filter((m) => m.status === "live");
  const favoriteMatches = useMemo(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return allMatches.filter((m) => favorites.includes(m.id));
  }, [allMatches, favoritesUpdate]);

  if (error) return <PageErrors err={error} onRetry={refetch} />;

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="hidden md:block text-2xl font-bold mb-8">
          {param?.pathname === "/"
            ? "LIVE MATCHES"
            : param?.pathname.split("/")[1].toUpperCase().replace("-", " ")}
        </h1>
        {!isLive && <DateSlider />}
        {loading ? (
          <>
            <div className="flex justify-start gap-3 md:gap-4 mb-8 ">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-56 w-full" />
            </div>
          </>
        ) : !hasMatches ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-400 text-lg">
              {`No ${isLive ? "live" : "upcoming"} matches found for this date`}
            </p>
          </div>
        ) : (
          <>
            {!isLive && (
              <div className="flex justify-start gap-3 md:gap-4 mb-8">
                <div
                  className={`flex items-center gap-2 px-2 md:px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                    activeFilter === "all"
                      ? "bg-primary text-black"
                      : "bg-gray-700 text-white"
                  }`}
                  onClick={() => setActiveFilter("all")}
                >
                  <span>All</span>
                  <Badge
                    className={
                      activeFilter === "all"
                        ? "bg-black text-white text-xs"
                        : "bg-gray-600 text-white text-xs"
                    }
                  >
                    {allMatches.length}
                  </Badge>
                </div>
                <div
                  className={`flex items-center gap-2 px-2 md:px-4 py-2 rounded-lg text-sm cursor-pointer ${
                    activeFilter === "live"
                      ? "bg-primary text-black"
                      : "bg-gray-700 text-white"
                  }`}
                  onClick={() => setActiveFilter("live")}
                >
                  <Radio className="w-4 h-4" />
                  <span>Live</span>
                  <Badge
                    className={
                      activeFilter === "live"
                        ? "bg-black text-white text-xs"
                        : "bg-gray-600 text-white text-xs"
                    }
                  >
                    {liveMatches.length}
                  </Badge>
                </div>
                <div
                  className={`flex items-center gap-2 px-2 md:px-4 py-2 rounded-lg text-sm cursor-pointer ${
                    activeFilter === "favorites"
                      ? "bg-primary text-black"
                      : "bg-gray-700 text-white"
                  }`}
                  onClick={() => setActiveFilter("favorites")}
                >
                  <Heart className="w-4 h-4" />
                  <span>Favorites</span>
                  <Badge
                    className={
                      activeFilter === "favorites"
                        ? "bg-black text-white text-xs"
                        : "bg-gray-600 text-white text-xs"
                    }
                  >
                    {favoriteMatches.length}
                  </Badge>
                </div>
              </div>
            )}
            <div className="space-y-6">
              {Object.keys(filteredMatches).length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <p className="text-gray-400 text-lg">
                    No {activeFilter} matches found for this date
                  </p>
                </div>
              ) : (
                Object.entries(filteredMatches).map(([league, matches]) => (
                  <div key={league} className="bg-muted px-6 py-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium">{league}</h2>
                    </div>

                    <div className="space-y-3">
                      {matches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          showTime={match.status === "scheduled"}
                          onFavoriteChange={handleFavoritesChange}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
