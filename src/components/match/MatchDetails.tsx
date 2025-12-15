import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EventTimeline from "./EventTimeline";
import { useParams } from "react-router-dom";
import useMatchDetail from "@/hooks/useMatchDetail";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { tabs } from "@/lib/routes/navigationItems";
import PageErrors from "../ErrorComponents/PageErrors";

export function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const { matchDetail, loading, error, refetch } = useMatchDetail(id || "");
  const [activeTab, setActiveTab] = useState("events");
  if (error) return <PageErrors err={error} onRetry={refetch} />;

  const timelineEvents =
    matchDetail?.timeline
      .slice()
      .reverse()
      .map((event) => ({
        time: `${event.time}'`,
        eventType: event.type.toLowerCase(),
        homePlayer: event.team === "home" ? event.player : null,
        awayPlayer: event.team === "away" ? event.player : null,
        detail: event.detail,
        isHome: event?.isHome,
      })) || [];

  const homeCards = timelineEvents.filter(
    (event) => event.isHome && event.eventType === "card"
  );
  const awayCards = timelineEvents.filter(
    (event) => !event.isHome && event.eventType === "card"
  );

  const getCardCounts = (cards: any[]) => ({
    yellowCards: cards.filter((card) => card.detail === "Yellow Card").length,
    redCards: cards.filter((card) => card.detail === "Red Card").length,
  });

  const homeCardCounts = getCardCounts(homeCards);
  const awayCardCounts = getCardCounts(awayCards);

  return (
    <div className="bg-background min-h-screen text-white">
      {loading ? (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-muted px-6 pt-4 rounded-lg">
            <div
              className="flex items-center gap-3 mb-6"
              onClick={() => {
                window.history.back();
              }}
            >
              <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-primary" />
              <span className="text-gray-300">{matchDetail?.league}</span>
            </div>

            <div className="text-center mb-8 ">
              <div className="flex items-center justify-center lg:gap-28 gap-8 mb-4">
                <div className="flex flex-col gap-4 items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={matchDetail?.homeTeam.logo}
                        alt={matchDetail?.homeTeam.name}
                      />
                      <AvatarFallback>
                        <span className="text-white text-xs font-bold">
                          {matchDetail?.homeTeam.name.slice(0, 2)}
                        </span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 flex gap-1">
                      {homeCardCounts.yellowCards > 0 && (
                        <div className="bg-yellow-200 text-black text-xs w-4 h-5  flex items-center justify-center font-bold">
                          {homeCardCounts.yellowCards}
                        </div>
                      )}
                      {homeCardCounts.redCards > 0 && (
                        <div className="bg-red-500 text-white text-xs w-4 h-5  flex items-center justify-center font-bold">
                          {homeCardCounts.redCards}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm md:text-lg font-semibold">
                    {matchDetail?.homeTeam?.name}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-sm mb-2">
                    {matchDetail?.date && formatDate(matchDetail?.date)}
                  </div>
                  <div className="lg:text-4xl text-xl font-bold mb-2">
                    <span>
                      {matchDetail?.status !== "Not Started" &&
                        matchDetail?.homeScore}
                    </span>
                    <span className="mx-2">
                      {matchDetail?.status === "Not Started" ? "vs" : "-"}
                    </span>
                    <span>
                      {matchDetail?.status !== "Not Started" &&
                        matchDetail?.awayScore}
                    </span>
                  </div>
                  <Badge
                    variant={
                      matchDetail?.status === "Not Started"
                        ? "outline"
                        : matchDetail?.status === "Match Finished"
                        ? "destructive"
                        : matchDetail?.status === "Match Abandoned"
                        ? "destructive"
                        : "default"
                    }
                    className="text-xs rounded-sm"
                  >
                    {matchDetail?.status === "Not Started"
                      ? "Scheduled"
                      : matchDetail?.status === "Match Finished"
                      ? "Finished"
                      : matchDetail?.status === "Match Abandoned"
                      ? "Abandoned"
                      : "Live"}
                  </Badge>
                </div>
                <div className="flex flex-col gap-4 items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={matchDetail?.awayTeam.logo}
                        alt={matchDetail?.awayTeam.name}
                      />
                      <AvatarFallback>
                        <span className="text-foreground text-xs font-bold">
                          {matchDetail?.awayTeam.name.slice(0, 2)}
                        </span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -left-2 flex gap-1">
                      {awayCardCounts.yellowCards > 0 && (
                        <div className="bg-yellow-200 text-black text-xs h-5 w-4 flex items-center justify-center font-bold">
                          {awayCardCounts.yellowCards}
                        </div>
                      )}
                      {awayCardCounts.redCards > 0 && (
                        <div className="bg-red-500 text-white text-xs h-5 w-4 flex items-center justify-center font-bold">
                          {awayCardCounts.redCards}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm md:text-lg font-semibold">
                    {matchDetail?.awayTeam?.name}
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex justify-center gap-8 mb-8 overflow-x-auto cursor-pointer">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 ${
                    activeTab === tab.id
                      ? "border-b-2 border-green-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-4 bg-muted rounded-lg p-6 cursor-pointer">
            {activeTab === "events" && (
              <>
                <h3 className="text-lg font-medium mb-4">Events</h3>
                {matchDetail?.status === "Not Started" ? (
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-gray-400 text-sm mb-4">
                      {`Match schduled for ${matchDetail?.date} at ${matchDetail?.time}`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    {matchDetail?.status === "Match Finished" && (
                      <div className="text-center text-gray-400 text-sm mb-4">
                        Fulltime{" "}
                        {`${matchDetail?.homeScore} - ${matchDetail?.awayScore}`}
                      </div>
                    )}
                    <EventTimeline events={timelineEvents} />
                    <div className="flex justify-center items-center">
                      <span className="text-sm text-muted-foreground whitespace-nowrap px-4">
                        {`Kick Off - ${matchDetail?.time.slice(0, 5)}`}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
            {activeTab !== "events" && (
              <div className="text-center text-gray-400 py-8">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content
                coming soon
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
