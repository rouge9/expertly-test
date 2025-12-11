import type { Team } from ".";
import type { HeaderOption } from "./header.types";

export type MatchesContextType = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedSport: HeaderOption | null;
  setSelectedSport: (sport: HeaderOption) => void;
  selectedLeague: HeaderOption | null;
  setSelectedLeague: (league: HeaderOption | null) => void;
  groupedMatches: { [league: string]: any[] };
  loading: boolean;
  error: string | null;
  refetch: () => void;
  retry: () => void;
};

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: "live" | "finished" | "scheduled";
  date: string;
  time?: string;
  league: string;
  minute?: number;
}

export interface MatchCardProps {
  match: Match;
  showTime?: boolean;
}

export type ApiMatch = {
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
  idHomeTeam: string;
  idAwayTeam: string;
};

export type MatchesApiResponse = {
  events: ApiMatch[] | null;
};

export type MatchStatus = "live" | "finished" | "scheduled";

export type NormalizedMatch = {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
    shortName: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
    shortName: string;
  };
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  date: string;
  time?: string;
  league: string;
};

export type GroupedMatches = {
  [league: string]: NormalizedMatch[];
};

export type UseFetchMatchesResult = {
  matches: NormalizedMatch[];
  groupedMatches: GroupedMatches;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  retry: () => void;
};
