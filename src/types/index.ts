export interface Team {
  id: string;
  name: string;
  logo: string;
  shortName?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'finished' | 'scheduled';
  date: string;
  time?: string;
  league: string;
  minute?: number;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'corner' | 'offside';
  minute: number;
  player: string;
  team: 'home' | 'away';
  description?: string;
}

export interface League {
  id: string;
  name: string;
  matches: Match[];
}