import { createContext, useContext, useState, type ReactNode } from "react";
import useFetchMatches from "@/hooks/useFetchMatches";
import type { HeaderOption } from "@/types/header.types";
import type { MatchesContextType } from "@/types/match.types";

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState<HeaderOption | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<HeaderOption | null>(
    null
  );
  const [selectedCountry, setSelectedCountry] = useState<HeaderOption | null>(
    null
  );

  const formattedDate = currentDate.toISOString().split("T")[0];
  const {
    groupedMatches: allMatches,
    loading,
    error,
    refetch,
    retry,
  } = useFetchMatches(formattedDate, selectedSport?.name);

  const countryFilteredMatches = selectedCountry
    ? Object.fromEntries(
        Object.entries(allMatches)
          .map(([league, matches]) => [
            league,
            matches.filter((match) => match.country === selectedCountry.name),
          ])
          .filter(([, matches]) => matches.length > 0)
      )
    : allMatches;

  const groupedMatches = selectedLeague
    ? {
        [selectedLeague.name]:
          countryFilteredMatches[selectedLeague.name] || [],
      }
    : countryFilteredMatches;

  return (
    <MatchesContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        selectedSport,
        setSelectedSport,
        selectedLeague,
        setSelectedLeague,
        selectedCountry,
        setSelectedCountry,
        groupedMatches,
        loading,
        error,
        refetch,
        retry,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (context === undefined) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
};
