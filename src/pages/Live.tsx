import { Fixtures } from "@/components/Fixtures/Fixtures";
import useFetchLiveMatches from "@/hooks/useFetchLiveMatches";

export const Live = () => {
  const { groupedMatches, loading, error } = useFetchLiveMatches(
    "Soccer",
    20000
  );
  return (
    <Fixtures
      groupedMatches={groupedMatches}
      loading={loading}
      error={error}
      isLive={true}
    />
  );
};
