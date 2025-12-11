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
