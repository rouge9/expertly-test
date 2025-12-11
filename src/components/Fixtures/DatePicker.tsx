import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarDays } from "lucide-react";
import { Calendar } from "../ui/calendar";

interface DatePickerProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

export const DatePicker = ({
  setOpen,
  currentDate,
  setCurrentDate,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <CalendarDays className="w-10 h-10 md:w-5 md:h-5 text-primary md:text-white cursor-pointer hover:text-white/80" />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0"
        align="end"
        alignOffset={-8}
        sideOffset={10}
      >
        <Calendar
          mode="single"
          selected={currentDate}
          captionLayout="dropdown"
          month={currentDate}
          onMonthChange={setCurrentDate}
          onSelect={(date) => {
            setCurrentDate(date ?? currentDate);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
