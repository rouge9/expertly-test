export type LeagueApiResponse = {
  leagues: {
    idLeague: string;
    strLeague: string;
    strSport: string;
  }[];
};

export type CountryApiResponse = {
  countries: {
    name_en: string;
    flag_url_32: string;
  }[];
};

export type SportApiResponse = {
  sports: {
    idSport: string;
    strSport: string;
    strSportIconGreen: string;
  }[];
};

export type HeaderOption = {
  id: string;
  name: string;
  icon: string;
};

export type HeaderOptionsData = {
  countries: HeaderOption[];
  leagues: HeaderOption[];
  sports: HeaderOption[];
};

export type UseHeaderOptionsResult = {
  data: HeaderOptionsData;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  retry: () => void;
};

export type HeaderDropdownProps = {
  options: HeaderOption[];
  selected?: HeaderOption;
  onSelect: (option: HeaderOption) => void;
  fallbackIcon: string;
  fallbackText: string;
  loading?: boolean;
  className?: string;
};

export type LeagueDropdownProps = {
  options: HeaderOption[];
  selected?: HeaderOption;
  onSelect: (option: HeaderOption) => void;
  loading?: boolean;
};
