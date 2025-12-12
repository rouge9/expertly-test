import { Fixtures } from "@/components/Fixtures/Fixtures";
import { useMatches } from "@/context/MatchesContext";

export const Matches = () => {
  const { groupedMatches, loading, error, refetch } = useMatches();
  return (
    <Fixtures
      groupedMatches={groupedMatches}
      loading={loading}
      error={error}
      isLive={false}
      refetch={refetch}
    />
  );
};
