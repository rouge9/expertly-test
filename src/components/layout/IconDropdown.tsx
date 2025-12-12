import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import type { HeaderDropdownProps } from "@/types/header.types";

export function IconDropdown({
  options,
  selected,
  onSelect,
  fallbackIcon,
  fallbackText,
  loading = false,
  className = "",
}: HeaderDropdownProps) {
  if (loading)
    return (
      <Skeleton className="w-5 h-5 md:w-10 md:h-10 rounded-full bg-background/20" />
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`bg-background/20 rounded-full p-1.5 md:p-2 cursor-pointer ${className}`}
        >
          <Avatar className="w-5 h-5 md:w-8 md:h-8">
            <AvatarImage
              src={selected?.icon || fallbackIcon}
              className="bg-white"
            />
            <AvatarFallback>{fallbackText}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-56 border-none">
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
            <Avatar className="w-6 h-6">
              <AvatarImage src={option.icon} className="bg-white" />
              <AvatarFallback>{option.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span>{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
