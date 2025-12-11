import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { DatePicker } from "./DatePicker";
import { useMatches } from "@/context/MatchesContext";

export const DateSlider = () => {
  const { currentDate, setCurrentDate } = useMatches();
  const [open, setOpen] = useState(false);

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const formatDateForDisplay = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getSurroundingDates = (centerDate: Date): Date[] => {
    const dates: Date[] = [];
    for (let i = -2; i <= 2; i++) {
      const newDate = new Date(centerDate);
      newDate.setDate(newDate.getDate() + i);
      dates.push(newDate);
    }
    return dates;
  };

  const formatMobileDate = (date: Date, isCenter: boolean) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday && isCenter) {
      return `Today ${date.getDate()} ${date
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase()}`;
    }

    return `${date
      .toLocaleString("en-US", { weekday: "short" })
      .toUpperCase()} ${date.getDate()} ${date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase()}`;
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
  };
  return (
    <>
      <div className="hidden md:flex items-center justify-between gap-4 mb-8 bg-muted py-4 rounded-lg px-4">
        <ChevronLeft
          onClick={handlePrevDay}
          className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white"
        />
        <div className="flex items-center gap-2">
          <DatePicker
            setOpen={setOpen}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
          <span className="font-medium">
            {formatDateForDisplay(currentDate)}
          </span>
        </div>
        <ChevronRight
          onClick={handleNextDay}
          className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white"
        />
      </div>

      <div className="md:hidden flex justify-between items-center mb-6 text-sm px-8 text-center">
        {getSurroundingDates(currentDate).map((date, index) => {
          const isCenter = index === 2;
          const isFarEdge = index === 0 || index === 4;
          let className = "cursor-pointer ";
          if (isCenter) {
            className +=
              "text-primary font-medium backdrop-blur bg-primary/20 px-3 py-2 rounded-lg";
          } else if (isFarEdge) {
            className += "text-gray-600";
          } else {
            className += "text-gray-400";
          }

          const handleClick = () => {
            if (index === 0) handlePrevDay();
            else if (index === 4) handleNextDay();
            else handleDateSelect(date);
          };

          return (
            <span
              key={date.toISOString()}
              className={className}
              onClick={handleClick}
            >
              {formatMobileDate(date, isCenter)}
            </span>
          );
        })}
        <DatePicker
          setOpen={setOpen}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      </div>
    </>
  );
};
