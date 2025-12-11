import { useState, useEffect, useRef, useCallback } from "react";
import axios, { AxiosError } from "axios";
import {
  ALL_COUNTRIES,
  ALL_LEAGUES,
  ALL_SPORTS,
} from "../lib/data/constant-api-path";
import type {
  CountryApiResponse,
  HeaderOptionsData,
  LeagueApiResponse,
  SportApiResponse,
  UseHeaderOptionsResult,
} from "@/types/header.types";

const useHeaderOptions = (): UseHeaderOptionsResult => {
  const [data, setData] = useState<HeaderOptionsData>({
    countries: [],
    leagues: [],
    sports: [],
  });
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

  const fetchOnce = useCallback(async (signal?: AbortSignal) => {
    const [countriesResp, leaguesResp, sportsResp] = await Promise.all([
      axios.get<CountryApiResponse>(ALL_COUNTRIES, { timeout: 10000, signal }),
      axios.get<LeagueApiResponse>(ALL_LEAGUES, { timeout: 10000, signal }),
      axios.get<SportApiResponse>(ALL_SPORTS, { timeout: 10000, signal }),
    ]);

    return {
      countries:
        countriesResp.data?.countries?.map((country) => ({
          id: country.name_en,
          name: country.name_en,
          icon: country.flag_url_32,
        })) || [],
      leagues:
        leaguesResp.data?.leagues?.map((league) => ({
          id: league.idLeague,
          name: league.strLeague,
          icon: "",
        })) || [],
      sports:
        sportsResp.data?.sports?.map((sport) => ({
          id: sport.idSport,
          name: sport.strSport,
          icon: sport.strSportIconGreen,
        })) || [],
    };
  }, []);

  const performFetchWithRetries = useCallback(
    async (isInitial = true) => {
      clearAbort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (isInitial) setLoading(true);
      setError(null);

      while (attemptsRef.current <= MAX_RETRIES && mountedRef.current) {
        try {
          const result = await fetchOnce(controller.signal);
          if (!mountedRef.current) return;
          setData(result);
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
            setError(axiosErr?.message ?? "Failed to fetch header options");
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
    [fetchOnce, clearAbort]
  );

  const refetch = useCallback(() => {
    attemptsRef.current = 0;
    setData({ countries: [], leagues: [], sports: [] });
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
  }, [performFetchWithRetries, clearAbort]);

  return { data, loading, error, refetch, retry };
};

export default useHeaderOptions;
