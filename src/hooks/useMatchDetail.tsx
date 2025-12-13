import { useState, useEffect, useRef, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { LOOKUP_EVENT, LOOKUP_TIMELINE } from "@/lib/data/constant-api-path";
import type {
  MatchDetail,
  MatchDetailApiResponse,
  TimelineApiResponse,
  TimelineEvent,
  UseMatchDetailResult,
} from "@/types/matchDetails.types";

const useMatchDetail = (matchId: string): UseMatchDetailResult => {
  const [matchDetail, setMatchDetail] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef<boolean>(true);
  const attemptsRef = useRef<number>(0);
  const abortRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

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

  const isLiveMatch = useCallback((status: string): boolean => {
    const lowerStatus = status.toLowerCase();
    return (
      lowerStatus.includes("live") ||
      lowerStatus.includes("'") ||
      lowerStatus.includes("1h") ||
      lowerStatus.includes("2h")
    );
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
      if (!matchId || !mountedRef.current) {
        setMatchDetail(null);
        setError(null);
        setLoading(false);
        return;
      }

      clearAbort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (isInitial && mountedRef.current) setLoading(true);
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
            if (mountedRef.current) {
              setError(axiosErr?.message ?? "Failed to fetch match details");
            }
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

      if (isInitial && mountedRef.current) setLoading(false);
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [matchId, performFetchWithRetries, clearAbort]);

  useEffect(() => {
    const isMatchDetailPage = window.location.pathname.includes("/match/");

    if (matchDetail && isLiveMatch(matchDetail.status) && isMatchDetailPage) {
      intervalRef.current = setInterval(() => {
        if (mountedRef.current) {
          attemptsRef.current = 0;
          performFetchWithRetries(false);
        }
      }, 20000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [matchDetail, performFetchWithRetries, isLiveMatch]);

  return { matchDetail, loading, error, refetch, retry };
};

export default useMatchDetail;
