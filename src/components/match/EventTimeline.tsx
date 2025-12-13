import { UserCheck, Repeat2, Volleyball, Flag } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import type { EventTimelineProps } from "@/types/matchDetails.types";

function getEventIcon(eventType?: string, card?: string) {
  switch (eventType) {
    case "subst":
      return <Repeat2 className="w-5 h-5 text-primary" />;
    case "card":
      return (
        <div
          className={`w-4 h-5 rounded-sm ${
            card === "Yellow Card" ? "bg-yellow-200" : "bg-red-500"
          }`}
        />
      );
    case "pass":
      return <UserCheck className="w-5 h-5" />;
    case "corner":
      return <Flag className="w-5 h-5" />;
    case "goal":
      return <Volleyball className="w-5 h-5 text-primary" />;
    default:
      return null;
  }
}

export default function EventTimeline({ events }: EventTimelineProps) {
  return (
    <div className="space-y-6">
      {events.map((event, idx) => (
        <div
          key={idx}
          className="items-center justify-center gap-9 py-2 grid grid-cols-3"
        >
          <div className="flex items-center gap-3">
            {event.isHome && event.homePlayer && (
              <>
                <p className="text-sm max-w-12">{event.homePlayer}</p>
              </>
            )}
            {event.isHome &&
              event.eventType &&
              getEventIcon(event.eventType, event?.detail)}
          </div>

          <div className="flex flex-col items-center">
            <Badge
              className={cn(
                "text-sm text-primary-foreground whitespace-nowrap px-4",
                event?.eventType === "goal"
                  ? "bg-primary"
                  : "bg-slate-600 text-white"
              )}
            >
              {event.time}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {!event.isHome &&
              event.eventType &&
              getEventIcon(event.eventType, event?.detail)}
            {event.awayPlayer && (
              <>
                <p className="text-sm max-w-12">{event.awayPlayer}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
