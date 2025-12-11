import { useState, useEffect, useRef, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { LOOKUP_EVENT, LOOKUP_TIMELINE } from "@/lib/data/constant-api-path";

type ApiMatchDetail = {
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

type ApiTimelineEvent = {
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

type MatchDetailApiResponse = {
  events: ApiMatchDetail[] | null;
};

type TimelineApiResponse = {
  timeline: ApiTimelineEvent[] | null;
};

type TimelineEvent = {
  id: string;
  type: string;
  detail: string;
  time: number;
  player: string;
  team: "home" | "away";
  teamName: string;
  isHome: boolean;
};

type MatchDetail = {
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

type UseMatchDetailResult = {
  matchDetail: MatchDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  retry: () => void;
};

const useMatchDetail = (matchId: string): UseMatchDetailResult => {
  const [matchDetail, setMatchDetail] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef<boolean>(true);
  const attemptsRef = useRef<number>(0);
  const abortRef = useRef<AbortController | null>(null);

  const MAX_RETRIES = 2;
  const INITIAL_BACKOFF_MS = 1000;

  const clearAbort = useCallback(() => {
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch {
        console.log("Abort failed.");
      }
      abortRef.current = null;
    }
  }, []);

  const fetchOnce = useCallback(
    async (signal?: AbortSignal) => {
      const [matchResponse, timelineResponse] = await Promise.all([
        axios.get<MatchDetailApiResponse>(`${LOOKUP_EVENT}${matchId}`, {
          timeout: 10000,
          signal,
        }),
        axios.get<TimelineApiResponse>(`${LOOKUP_TIMELINE}${matchId}`, {
          timeout: 10000,
          signal,
        }),
      ]);

      const event = matchResponse.data?.events?.[0];
      if (!event) return null;

      const timelineEvents = timelineResponse.data?.timeline || [];

      const timeline: TimelineEvent[] = timelineEvents.map((t) => ({
        id: t.idTimeline,
        type: t.strTimeline,
        detail: t.strTimelineDetail,
        time: parseInt(t.intTime || "0"),
        player: t.strPlayer || "",
        team: t.strHome === "Yes" ? "home" : "away",
        isHome: t.strHome === "Yes",
        teamName: t.strTeam || "",
      }));

      return {
        id: event.idEvent,
        homeTeam: {
          id: event.idHomeTeam,
          name: event.strHomeTeam,
          logo: event.strHomeTeamBadge || "",
        },
        awayTeam: {
          id: event.idAwayTeam,
          name: event.strAwayTeam,
          logo: event.strAwayTeamBadge || "",
        },
        homeScore: parseInt(event.intHomeScore || "0"),
        awayScore: parseInt(event.intAwayScore || "0"),
        status: event.strStatus,
        date: event.dateEvent,
        time: event.strTime,
        league: event.strLeague,
        venue: event.strVenue || "",
        city: event.strCity || "",
        country: event.strCountry || "",
        description: event.strDescriptionEN || "",
        timeline: timeline.sort((a, b) => a.time - b.time),
      };
    },
    [matchId]
  );

  const performFetchWithRetries = useCallback(
    async (isInitial = true) => {
      if (!matchId) {
        setMatchDetail(null);
        setError(null);
        setLoading(false);
        return;
      }

      clearAbort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (isInitial) setLoading(true);
      setError(null);

      while (attemptsRef.current <= MAX_RETRIES && mountedRef.current) {
        try {
          const result = await fetchOnce(controller.signal);
          if (!mountedRef.current) return;
          setMatchDetail(result);
          setError(null);
          attemptsRef.current = 0;
          break;
        } catch (err) {
          if (!mountedRef.current) return;

          if (
            (err as any)?.name === "CanceledError" ||
            (err as any)?.code === "ERR_CANCELED"
          ) {
            return;
          }

          const axiosErr = err as AxiosError;
          attemptsRef.current += 1;

          if (attemptsRef.current > MAX_RETRIES) {
            setError(axiosErr?.message ?? "Failed to fetch match details");
            break;
          }

          const backoff =
            INITIAL_BACKOFF_MS * Math.pow(2, attemptsRef.current - 1);
          await new Promise<void>((resolve) => {
            const t = setTimeout(() => {
              clearTimeout(t);
              resolve();
            }, backoff);
          });
        }
      }

      if (isInitial) setLoading(false);
    },
    [matchId, fetchOnce, clearAbort]
  );

  const refetch = useCallback(() => {
    attemptsRef.current = 0;
    setMatchDetail(null);
    setError(null);
    performFetchWithRetries(true);
  }, [performFetchWithRetries]);

  const retry = useCallback(() => {
    attemptsRef.current = 0;
    setError(null);
    performFetchWithRetries(true);
  }, [performFetchWithRetries]);

  useEffect(() => {
    mountedRef.current = true;
    attemptsRef.current = 0;
    performFetchWithRetries(true);

    return () => {
      mountedRef.current = false;
      clearAbort();
    };
  }, [matchId, performFetchWithRetries, clearAbort]);

  return { matchDetail, loading, error, refetch, retry };
};

export default useMatchDetail;
