import { useState, useEffect, useRef, useCallback } from "react";
import axios, { AxiosError } from "axios";
import type {
  GroupedMatches,
  MatchesApiResponse,
  MatchStatus,
  NormalizedMatch,
  UseFetchMatchesResult,
} from "@/types/match.types";
import { MATCH_EVENTS_DAY } from "@/lib/data/constant-api-path";
import type { HookError } from "@/types";

const useFetchLiveMatches = (
  sport: string = "Soccer",
  refreshInterval: number = 20000
): UseFetchMatchesResult => {
  const [matches, setMatches] = useState<NormalizedMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef<boolean>(true);
  const intervalRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

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

  const fetchLiveEvents = useCallback(
    async (signal?: AbortSignal) => {
      const today = new Date().toISOString().split("T")[0];
      const url = `${MATCH_EVENTS_DAY}d=${today}&s=${sport}`;
      const response = await axios.get<MatchesApiResponse>(url, {
        timeout: 10000,
        signal,
      });

      const events = response.data?.events || [];

      const liveEvents = events.filter((event) => {
        const status = normalizeStatus(event.strStatus);
        return status === "live";
      });

      return liveEvents.map(
        (event): NormalizedMatch => ({
          id: event.idEvent,
          homeTeam: {
            id: event.idHomeTeam,
            name: event.strHomeTeam,
            logo: event.strHomeTeamBadge || "",
            shortName: event.strHomeTeam.substring(0, 3).toUpperCase(),
          },
          awayTeam: {
            id: event.idAwayTeam,
            name: event.strAwayTeam,
            logo: event.strAwayTeamBadge || "",
            shortName: event.strAwayTeam.substring(0, 3).toUpperCase(),
          },
          homeScore: parseInt(event.intHomeScore || "0"),
          awayScore: parseInt(event.intAwayScore || "0"),
          status: "live" as MatchStatus,
          date: event.dateEvent,
          time: event.strTime,
          league: event.strLeague,
          country: event.strCountry,
        })
      );
    },
    [sport]
  );

  const performFetch = useCallback(
    async (isInitial = true) => {
      clearAbort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (isInitial) setLoading(true);
      setError(null);

      try {
        const result = await fetchLiveEvents(controller.signal);
        if (!mountedRef.current) return;
        setMatches(result);
        setError(null);
      } catch (err) {
        if (!mountedRef.current) return;

        if (
          (err as HookError)?.name === "CanceledError" ||
          (err as HookError)?.code === "ERR_CANCELED"
        ) {
          return;
        }

        const axiosErr = err as AxiosError;
        setError(axiosErr?.message ?? "Failed to fetch live matches");
      }

      if (isInitial) setLoading(false);
    },
    [fetchLiveEvents, clearAbort]
  );

  const refetch = useCallback(() => {
    setMatches([]);
    setError(null);
    performFetch(true);
  }, [performFetch]);

  const retry = useCallback(() => {
    setError(null);
    performFetch(true);
  }, [performFetch]);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line
    performFetch(true);

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        if (mountedRef.current) {
          performFetch(false);
        }
      }, refreshInterval);
    }

    return () => {
      mountedRef.current = false;
      clearAbort();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [sport, refreshInterval, performFetch, clearAbort]);

  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.league]) {
      acc[match.league] = [];
    }
    acc[match.league].push(match);
    return acc;
  }, {} as GroupedMatches);

  return { matches, groupedMatches, loading, error, refetch, retry };
};

export default useFetchLiveMatches;
