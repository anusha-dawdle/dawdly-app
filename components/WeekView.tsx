"use client";

import type { DawdlyEvent } from "@/lib/types";
import {
  getWeekDays,
  formatDayHeader,
  isToday,
  formatMonthYear,
  startOfWeek,
} from "@/lib/dates";
import EventPill from "./EventPill";
import CharmIcon from "./CharmIcon";

interface WeekViewProps {
  anchor: string;
  getEventsForDate: (date: string) => DawdlyEvent[];
  onDayClick: (date: string) => void;
  onDeleteEvent: (id: string) => void;
}

export default function WeekView({
  anchor,
  getEventsForDate,
  onDayClick,
  onDeleteEvent,
}: WeekViewProps) {
  const days = getWeekDays(anchor);
  const monthLabel = formatMonthYear(days[0]);

  return (
    <div className="flex flex-col h-full">
      {/* Month label */}
      <div className="px-6 pt-2 pb-1">
        <span
          className="text-sm font-medium"
          style={{ color: "#B0A090", fontFamily: "Georgia, serif" }}
        >
          {monthLabel}
        </span>
      </div>

      {/* Day columns */}
      <div className="flex flex-1 gap-3 px-4 pb-4 overflow-hidden">
        {days.map((day) => {
          const { weekday, day: dayNum } = formatDayHeader(day);
          const events = getEventsForDate(day);
          const todayDay = isToday(day);

          return (
            <div
              key={day}
              className="flex-1 flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: todayDay ? "#FFFBEF" : "transparent",
                border: todayDay ? "1.5px solid #FDE68A" : "1.5px solid transparent",
              }}
            >
              {/* Day header */}
              <button
                onClick={() => onDayClick(day)}
                className="flex flex-col items-center pt-3 pb-2 transition-colors rounded-t-2xl hover:bg-amber-50"
              >
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: todayDay ? "#D97706" : "#B0A090" }}
                >
                  {weekday}
                </span>
                <span
                  className="text-lg font-semibold mt-0.5"
                  style={{
                    color: todayDay ? "#D97706" : "#2D2017",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {dayNum}
                </span>
              </button>

              {/* Events */}
              <div className="flex-1 px-1.5 pb-2 flex flex-col gap-1 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="flex-1" />
                ) : (
                  events.map((event) => (
                    <EventPill
                      key={event.id}
                      event={event}
                      onDelete={onDeleteEvent}
                      compact
                    />
                  ))
                )}
              </div>

              {/* Add button */}
              <button
                onClick={() => onDayClick(day)}
                className="mx-1.5 mb-1.5 rounded-lg py-1 text-xs opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100 flex items-center justify-center"
                style={{ background: "#F5EFE6", color: "#B0A090" }}
                title={`Add to ${weekday}`}
              >
                + add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
