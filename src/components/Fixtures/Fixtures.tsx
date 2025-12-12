import { ChevronRight, Heart, Radio } from "lucide-react";
import { MatchCard } from "../match/MatchCard";
import { Badge } from "@/components/ui/badge";
import { DateSlider } from "./DateSlider";
import { Skeleton } from "../ui/skeleton";
import type { FixturesProps } from "@/types/match.types";
import { useLocation } from "react-router-dom";
import PageErrors from "../ErrorComponents/PageErrors";

export function Fixtures({
  groupedMatches = {},
  loading = false,
  error = null,
  isLive = true,
}: FixturesProps) {
  const param = useLocation();
  const hasMatches = Object.keys(groupedMatches).length > 0;

  if (error) return <PageErrors err={error} />;

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
                <div className="flex items-center gap-2 bg-primary text-black px-2 md:px-4 py-2 rounded-lg text-sm font-medium">
                  <span>All</span>
                  <Badge className="bg-black text-white text-xs">
                    {" "}
                    {Object.values(groupedMatches).flat().length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 bg-gray-700 text-white px-2 md:px-4 py-2 rounded-lg text-sm">
                  <Radio className="w-4 h-4" />
                  <span>Live</span>
                  <Badge className="bg-gray-600 text-white text-xs">
                    {
                      Object.values(groupedMatches)
                        .flat()
                        .filter((m) => m.status === "live").length
                    }
                  </Badge>
                </div>
                <div className="flex items-center gap-2 bg-gray-700 text-white px-2 md:px-4 py-2 rounded-lg text-sm">
                  <Heart className="w-4 h-4" />
                  <span>Favorites</span>
                  <Badge className="bg-gray-600 text-white text-xs">0</Badge>
                </div>
              </div>
            )}
            <div className="space-y-6">
              {Object.entries(groupedMatches).map(([league, matches]) => (
                <div key={league} className="bg-muted px-6 py-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">{league}</h2>
                    {matches.length > 0 && (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  <div className="space-y-3">
                    {matches.length === 0 ? (
                      <div className="flex justify-center items-center">
                        <p className="text-gray-400 text-sm">
                          No matches found
                        </p>
                      </div>
                    ) : (
                      matches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          showTime={match.status === "scheduled"}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
