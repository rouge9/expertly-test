import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navigationItems = [
  { label: "Live", href: "/" },
  { label: "Matches", href: "/matches" },
  { label: "Standings", href: "/standings" },
  { label: "Teams", href: "/teams" },
  { label: "Comparison", href: "/comparison" },
  { label: "Statistics", href: "/statistics" },
  { label: "Venues", href: "/venues" },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="bg-background/20 rounded-full p-1.5 md:p-2">
              <Avatar className="w-5 h-5 md:w-8 md:h-8">
                <AvatarImage src="/assets/earth.png" />
                <AvatarFallback>GL</AvatarFallback>
              </Avatar>
            </div>
            <div className="bg-background/20 rounded-full p-1.5 md:p-2">
              <Avatar className="w-5 h-5 md:w-8 md:h-8">
                <AvatarImage src="/assets/soccer-ball.png" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="bg-background/20 rounded-full p-1.5 md:p-2 block md:hidden">
            <Avatar className="w-5 h-5 md:w-8 md:h-8">
              <AvatarImage src="/assets/england.png" />
              <AvatarFallback>EN</AvatarFallback>
            </Avatar>
          </div>
          <div className="bg-background/20 rounded-full md:p-2 hidden md:flex md:px-4 md:py-3 gap-2 hover:bg-muted cursor-pointer">
            <Avatar className="w-5 h-5">
              <AvatarImage src="/assets/england.png" />
              <AvatarFallback>EN</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Premier Leauge</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </div>

          <div className="bg-background/20 rounded-full flex px-2 md:px-4 py-2 md:py-3 gap-2 hover:bg-muted cursor-pointer">
            <span className="text-sm font-medium">2024/25</span>
            <ChevronDown className="w-4 h-4 md:ml-2" />
          </div>
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
        <nav className="xl:hidden border-t border-primary/20 bg-primary/50 backdrop-blur">
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
