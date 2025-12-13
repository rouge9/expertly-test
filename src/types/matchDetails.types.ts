export type ApiMatchDetail = {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string;
  dateEvent: string;
  strTime: string;
  strLeague: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strVenue: string;
  strCity: string;
  strCountry: string;
  strDescriptionEN: string;
  idHomeTeam: string;
  idAwayTeam: string;
};

export type ApiTimelineEvent = {
  idTimeline: string;
  idEvent: string;
  strTimeline: string;
  strTimelineDetail: string;
  strHome: string;
  strEvent: string;
  idPlayer: string;
  strPlayer: string;
  intTime: string;
  strTeam: string;
};

export type MatchDetailApiResponse = {
  events: ApiMatchDetail[] | null;
};

export type TimelineApiResponse = {
  timeline: ApiTimelineEvent[] | null;
};

export type TimelineEvent = {
  id: string;
  type: string;
  detail: string;
  time: number;
  player: string;
  team: "home" | "away";
  teamName: string;
  isHome: boolean;
};

export type MatchDetail = {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
  };
  homeScore: number;
  awayScore: number;
  status: string;
  date: string;
  time: string;
  league: string;
  venue: string;
  city: string;
  country: string;
  description: string;
  timeline: TimelineEvent[];
};

export type UseMatchDetailResult = {
  matchDetail: MatchDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  retry: () => void;
};

export interface EventItem {
  time: string;
  awayPlayer?: string | null;
  eventType?: string;
  homePlayer?: string | null;
  isHome?: boolean;
  detail: string;
}

export interface EventTimelineProps {
  events: EventItem[];
}
