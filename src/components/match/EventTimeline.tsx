import type React from "react";
import {
  Clock,
  UserCheck,
  Repeat2,
  AlertCircle,
  Volleyball,
} from "lucide-react";
import { Badge } from "../ui/badge";

interface EventItem {
  time: string;
  awayPlayer?: string;
  awayTeam?: string;
  awayIcon?: React.ReactNode;
  icon?: React.ReactNode;
  eventType?: "substitution" | "card" | "pass" | "corner" | "goal" | "period";
  card?: "yellow" | "red";
  homePlayer?: string;
  homeTeam?: string;
  homeStatus?: string;
  homeIcon?: React.ReactNode;
}

interface EventTimelineProps {
  events: EventItem[];
}

function getEventIcon(eventType?: string, card?: "yellow" | "red") {
  switch (eventType) {
    case "substitution":
      return <Repeat2 className="w-5 h-5" />;
    case "card":
      return (
        <div
          className={`w-4 h-5 rounded-sm ${
            card === "yellow" ? "bg-yellow-400" : "bg-red-500"
          }`}
        />
      );
    case "pass":
      return <UserCheck className="w-5 h-5" />;
    case "corner":
      return <AlertCircle className="w-5 h-5" />;
    case "goal":
      return <Volleyball className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
  }
}

export default function EventTimeline({ events }: EventTimelineProps) {
  return (
    <div className="space-y-6">
      {events.map((event, idx) => (
        <div
          key={idx}
          className="items-center justify-center gap-4 py-2 grid grid-cols-3"
        >
          <div className="w-1/3 text-right flex flex-col">
            {event.awayPlayer && (
              <>
                <p className="font-medium text-sm">{event.awayPlayer}</p>
                {/* {event.awayTeam && (
                  <p className="text-xs text-muted-foreground">
                    {event.awayTeam}
                  </p>
                )} */}
              </>
            )}
            {event.awayIcon && <div className="mt-1">{event.awayIcon}</div>}
          </div>

          <div className="flex flex-col items-center">
            <Badge className="text-lg text-primary-foreground whitespace-nowrap px-4">
              {event.time}
            </Badge>
          </div>

          <div className="w-1/3 text-left ">
            {event.eventType && getEventIcon(event.eventType)}
            {event.homePlayer && (
              <>
                <p className="font-medium text-sm">{event.homePlayer}</p>
                {event.homeStatus && (
                  <p className="text-xs text-muted-foreground">
                    {event.homeStatus}
                  </p>
                )}
                {/* {event.homeTeam && (
                  <p className="text-xs text-muted-foreground">
                    {event.homeTeam}
                  </p>
                )} */}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
