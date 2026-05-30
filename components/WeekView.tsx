"use client";

import type { DawdlyEvent } from "@/lib/types";
import {
  getWeekDays,
  formatDayHeader,
  isToday,
  formatMonthYear,
  relativeDate,
} from "@/lib/dates";
import EventPill from "./EventPill";
import CharmIcon from "./CharmIcon";

interface WeekViewProps {
  anchor: string;
  events: DawdlyEvent[];
  getEventsForDate: (date: string) => DawdlyEvent[];
  onDayClick: (date: string) => void;
  onDeleteEvent: (id: string) => void;
}

export default function WeekView({
  anchor,
  events,
  getEventsForDate,
  onDayClick,
  onDeleteEvent,
}: WeekViewProps) {
  const days = getWeekDays(anchor);
  const monthLabel = formatMonthYear(days[0]);
  const weekEnd = days[6];

  // Events after this week, sorted soonest first
  const horizonEvents = events
    .filter((e) => e.date > weekEnd)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="flex flex-col h-full">
      {/* Month label */}
      <div className="px-6 pt-3 pb-2 text-center">
        <span
          className="text-3xl font-semibold"
          style={{ color: "#7C3D1A", fontFamily: "Georgia, serif" }}
        >
          {monthLabel}
        </span>
      </div>

      {/* Day columns with vertical dividers */}
      <div className="flex flex-1 px-4 overflow-hidden" style={{ minHeight: 0 }}>
        {days.map((day, i) => {
          const { weekday, day: dayNum } = formatDayHeader(day);
          const dayEvents = getEventsForDate(day);
          const todayDay = isToday(day);

          return (
            <div key={day} className="flex flex-1 min-w-0">
              {/* Divider before each column except the first */}
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    background: "#E8DDD0",
                    opacity: 0.5,
                    flexShrink: 0,
                  }}
                />
              )}

              <div
                className="flex-1 flex flex-col min-w-0 rounded-2xl overflow-hidden"
                style={{
                  background: todayDay ? "#FFFBEF" : "transparent",
                  outline: todayDay ? "1.5px solid #FDE68A" : "none",
                  outlineOffset: -1,
                }}
              >
                {/* Day header */}
                <button
                  onClick={() => onDayClick(day)}
                  className="flex flex-col items-center pt-3 pb-2 transition-colors rounded-t-2xl hover:bg-amber-50 w-full"
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
                      color: todayDay ? "#D97706" : "#7C3D1A",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {dayNum}
                  </span>
                </button>

                {/* Stacked charm events */}
                <div className="flex-1 pb-2 flex flex-col overflow-y-auto">
                  {dayEvents.map((event) => (
                    <EventPill
                      key={event.id}
                      event={event}
                      onDelete={onDeleteEvent}
                      stacked
                    />
                  ))}
                </div>

                {/* Add button */}
                <button
                  onClick={() => onDayClick(day)}
                  className="mx-1.5 mb-1.5 rounded-lg py-1 text-xs opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{ background: "#F5EFE6", color: "#B0A090" }}
                  title={`Add to ${weekday}`}
                >
                  + add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* On the horizon strip */}
      {horizonEvents.length > 0 && (
        <div
          className="flex-shrink-0 px-5 pt-3 pb-6"
          style={{ borderTop: "1px solid #F0EBE0" }}
        >
          <p
            className="mb-2.5"
            style={{
              color: "#8B7355",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            on the horizon
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {horizonEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-2.5 rounded-2xl px-3 py-2 flex-shrink-0"
                style={{
                  background: "#F5EFE6",
                  border: "1px solid #E8DDD0",
                }}
              >
                <CharmIcon charmId={event.charmId} size={24} />
                <div className="flex flex-col">
                  <span
                    className="text-sm font-medium whitespace-nowrap leading-snug"
                    style={{ color: "#7C3D1A" }}
                  >
                    {event.title}
                  </span>
                  <span
                    className="text-xs whitespace-nowrap leading-snug"
                    style={{ color: "#B0A090" }}
                  >
                    {relativeDate(event.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
