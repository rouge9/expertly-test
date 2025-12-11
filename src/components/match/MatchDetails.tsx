import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EventTimeline from "./EventTimeline";
import { useParams } from "react-router-dom";
import useMatchDetail from "@/hooks/useMatchDetail";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDate } from "@/lib/utils";

export function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const { matchDetail, loading, error } = useMatchDetail(id || "");
  if (loading) return <div>Loading match details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!matchDetail) return <div>Match not found</div>;

  console.log(matchDetail);

  const timelineEvents = matchDetail.timeline
    .slice()
    .reverse()
    .map((event) => ({
      time: `${event.time}'`,
      eventType: event.type.toLowerCase(),
      homePlayer: event.team === "home" ? event.player : null,
      awayPlayer: event.team === "away" ? event.player : null,
      detail: event.detail,
      isHome: event?.isHome,
    }));

  return (
    <div className="bg-background min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-muted px-6 pt-6 rounded-lg">
          <div
            className="flex items-center gap-3 mb-6"
            onClick={() => {
              window.history.back();
            }}
          >
            <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-green-400" />
            <span className="text-gray-300">{matchDetail?.league}</span>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center lg:gap-28 gap-8 mb-4">
              <div className="flex flex-col gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={matchDetail.homeTeam.logo}
                    alt={matchDetail.homeTeam.name}
                  />
                  <AvatarFallback>
                    <span className="text-white text-xs font-bold">
                      {matchDetail.homeTeam.name.slice(0, 2)}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <span className="text-lg font-semibold">
                  {matchDetail?.homeTeam?.name}
                </span>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground text-sm mb-2">
                  {formatDate(matchDetail?.date)}
                </div>
                <div className="lg:text-4xl text-xl font-bold mb-2">
                  <span>
                    {matchDetail?.status !== "Not Started" &&
                      matchDetail?.awayScore}
                  </span>
                  <span className="mx-2">
                    {matchDetail?.status === "Not Started" ? "vs" : "-"}
                  </span>
                  <span>
                    {matchDetail?.status !== "Not Started" &&
                      matchDetail?.homeScore}
                  </span>
                </div>
                <Badge
                  variant={
                    matchDetail?.status === "Not Started"
                      ? "outline"
                      : matchDetail?.status === "Match Finished"
                      ? "destructive"
                      : "default"
                  }
                  className="text-xs rounded-xl"
                >
                  {matchDetail?.status === "Not Started"
                    ? "Scheduled"
                    : matchDetail?.status === "Match Finished"
                    ? "Finished"
                    : "Live"}
                </Badge>
              </div>
              <div className="flex flex-col gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={matchDetail.awayTeam.logo}
                    alt={matchDetail.awayTeam.name}
                  />
                  <AvatarFallback>
                    <span className="text-foreground text-xs font-bold">
                      {matchDetail.awayTeam.name.slice(0, 2)}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <span className="text-lg font-semibold">
                  {matchDetail?.awayTeam?.name}
                </span>
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
              Fulltime {`${matchDetail?.homeScore} - ${matchDetail?.awayScore}`}
            </div>

            <EventTimeline events={timelineEvents} />
          </div>
        </div>
      </div>
    </div>
  );
}
