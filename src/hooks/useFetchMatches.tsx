import { useState, useEffect, useRef, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { MATCH_EVENTS_DAY } from "@/lib/data/constant-api-path";
import type {
  GroupedMatches,
  MatchesApiResponse,
  MatchStatus,
  NormalizedMatch,
  UseFetchMatchesResult,
} from "@/types/match.types";

const useFetchMatches = (
  date: string,
  sport: string = "Soccer"
): UseFetchMatchesResult => {
  const [matches, setMatches] = useState<NormalizedMatch[]>([]);
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

  const normalizeStatus = (status: string): MatchStatus => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("finished") || lowerStatus.includes("ft"))
      return "finished";
    if (
      lowerStatus.includes("live") ||
      lowerStatus.includes("'") ||
      lowerStatus.includes("1h") ||
      lowerStatus.includes("2h")
    )
      return "live";
    return "scheduled";
  };

  const fetchOnce = useCallback(
    async (signal?: AbortSignal) => {
      const url = `${MATCH_EVENTS_DAY}d=${date}&s=${sport}`;
      const response = await axios.get<MatchesApiResponse>(url, {
        timeout: 10000,
        signal,
      });

      const events = response.data?.events || [];

      return events.map(
        (event): NormalizedMatch => ({
          id: event.idEvent,
          homeTeam: {
            id: event.idHomeTeam,
            name: event.strHomeTeam,
            logo: event.strHomeTeamBadge || "",
            shortName:
              event.strHomeTeam?.substring(0, 3).toUpperCase() || "TBD",
          },
          awayTeam: {
            id: event.idAwayTeam,
            name: event.strAwayTeam,
            logo: event.strAwayTeamBadge || "",
            shortName:
              event.strAwayTeam?.substring(0, 3).toUpperCase() || "TBD",
          },
          homeScore: parseInt(event.intHomeScore || "0"),
          awayScore: parseInt(event.intAwayScore || "0"),
          status: normalizeStatus(event.strStatus),
          date: event.dateEvent,
          time: event.strTime,
          league: event.strLeague,
          country: event.strCountry,
        })
      );
    },
    [date, sport]
  );

  const performFetchWithRetries = useCallback(
    async (isInitial = true) => {
      if (!date) {
        setMatches([]);
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
          setMatches(result);
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
            setError(axiosErr?.message ?? "Failed to fetch matches");
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
    [date, fetchOnce, clearAbort]
  );

  const refetch = useCallback(() => {
    attemptsRef.current = 0;
    setMatches([]);
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
  }, [date, sport, performFetchWithRetries, clearAbort]);

  useEffect(() => {
    const hasLiveMatches = matches.some((match) => match.status === "live");
    const isMatchesPage = window.location.pathname === "/matches";

    if (hasLiveMatches && isMatchesPage) {
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
  }, [matches, performFetchWithRetries]);

  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.league]) {
      acc[match.league] = [];
    }
    acc[match.league].push(match);
    return acc;
  }, {} as GroupedMatches);

  return { matches, groupedMatches, loading, error, refetch, retry };
};

export default useFetchMatches;
