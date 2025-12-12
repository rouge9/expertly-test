import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import useHeaderOptions from "@/hooks/useHeaderOptions";
import { IconDropdown } from "./IconDropdown";
import { LeagueDropdown } from "./LeagueDropdown";
import { navigationItems } from "@/lib/routes/navigationItems";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useMatches } from "@/context/MatchesContext";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data, loading } = useHeaderOptions();
  const [selectedCountry, setSelectedCountry] = useState(data.countries[0]);
  const [selectedYear, setSelectedYear] = useState("2024/25");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const {
    selectedSport,
    setSelectedSport,
    selectedLeague,
    setSelectedLeague,
    setCurrentDate,
  } = useMatches();

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - 5 + i;
    return `${year}/${(year + 1).toString().slice(-2)}`;
  });

  return (
    <header className="bg-secondary border-b border-primary/20 sticky top-0 z-50">
      <div className="flex items-center justify-between px-2 py-4 md:px-6 gap-4">
        <Link to="/" className="flex items-center">
          <img
            src="/assets/logo.png"
            alt="logo"
            className="md:w-full md:h-full w-fit h-fit"
          />
        </Link>

        <nav className="hidden xl:flex items-center gap-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-xl font-medium transition-colors pb-3 ${
                location.pathname === item.href
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground/80 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex flex-row-reverse md:flex md:flex-row items-center gap-2">
            <IconDropdown
              options={data.sports}
              selected={selectedSport}
              onSelect={setSelectedSport}
              fallbackIcon="/assets/soccer-ball.png"
              fallbackText="SC"
              loading={loading}
            />

            <IconDropdown
              options={data.countries}
              selected={selectedCountry}
              onSelect={setSelectedCountry}
              fallbackIcon="/assets/earth.png"
              fallbackText="GL"
              loading={loading}
            />
          </div>
          <LeagueDropdown
            options={data.leagues}
            selected={selectedLeague}
            onSelect={setSelectedLeague}
            loading={loading}
          />

          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="bg-background/20 rounded-full flex px-2 md:px-4 py-2 md:py-3 gap-2 hover:bg-muted cursor-pointer">
                <span className="text-sm font-medium">{selectedYear}</span>
                <ChevronDown className="w-4 h-4 md:ml-2" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-muted" align="end">
              <div className="flex items-center justify-between p-2 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentYear((prev) => prev - 10)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-medium">
                  {currentYear - 5} - {currentYear + 4}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentYear((prev) => prev + 10)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-1 p-2">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setSelectedYear(year);
                      const yearStart = parseInt(year.split("/")[0]);
                      setCurrentDate(new Date(yearStart, 0, 1));
                      setIsPopoverOpen(false);
                    }}
                    className="justify-center"
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <div className="bg-background/20 rounded-full p-2 hidden md:block">
            <img
              src="/assets/united-kingdom.png"
              alt="globe"
              className="md:w-8 md:h-8"
            />
          </div>
          <div
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="xl:hidden border-t border-primary/20 bg-primary/50 backdrop-blur absolute top-full left-0 right-0">
          <div className="flex flex-col gap-2 px-4 py-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  location.pathname === item.href
                    ? "bg-white/10 text-accent"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
