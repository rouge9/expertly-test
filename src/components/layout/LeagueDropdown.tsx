import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import type { LeagueDropdownProps } from "@/types/header.types";

export function LeagueDropdown({
  options,
  selected,
  onSelect,
  loading = false,
}: LeagueDropdownProps) {
  if (loading)
    return (
      <Skeleton className="h-10 rounded-full w-[200px] bg-background/20" />
    );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="bg-background/20 rounded-full p-1.5 md:p-2 block md:hidden cursor-pointer">
            <div className="w-5 h-5 flex justify-center items-center">
              <span className="text-sm font-bold capitalize">
                {" "}
                {selected?.name.slice(0, 2) || "ALL"}{" "}
              </span>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-muted">
          <DropdownMenuItem
            onClick={() => onSelect(null)}
            className="flex items-center gap-2"
          >
            <span>ALL</span>
          </DropdownMenuItem>

          {options.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => onSelect(option)}
              className="flex items-center gap-2"
            >
              <span>{option.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="bg-background/20 rounded-full md:p-2 hidden md:flex md:px-4 md:py-3 gap-2 hover:bg-muted cursor-pointer 2xl:min-w-64 justify-between items-center">
            <span className="text-sm font-medium">
              {loading ? "Loading..." : selected?.name || "ALL"}
            </span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-muted">
          <DropdownMenuItem
            onClick={() => onSelect(null)}
            className="flex items-center gap-2"
          >
            <span>ALL</span>
          </DropdownMenuItem>

          {options.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => onSelect(option)}
              className="flex items-center gap-2"
            >
              <span>{option.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
