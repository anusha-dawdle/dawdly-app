"use client";

import type { DawdlyEvent } from "@/lib/types";
import { formatDayHeader, isToday } from "@/lib/dates";
import EventPill from "./EventPill";

interface DayViewProps {
  date: string;
  getEventsForDate: (date: string) => DawdlyEvent[];
  onAddClick: () => void;
  onDeleteEvent: (id: string) => void;
}

export default function DayView({
  date,
  getEventsForDate,
  onAddClick,
  onDeleteEvent,
}: DayViewProps) {
  const { weekday, day } = formatDayHeader(date);
  const events = getEventsForDate(date);
  const todayDay = isToday(date);

  return (
    <div className="flex flex-col h-full px-6 pb-6">
      <div className="pt-4 pb-6">
        <p
          className="text-sm uppercase tracking-widest font-medium"
          style={{ color: todayDay ? "#D97706" : "#B0A090" }}
        >
          {weekday}
        </p>
        <p
          className="text-6xl font-bold"
          style={{
            color: todayDay ? "#D97706" : "#7C3D1A",
            fontFamily: "Georgia, serif",
          }}
        >
          {day}
        </p>
      </div>

      {events.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-50">
          <p
            className="text-base text-center"
            style={{ color: "#B0A090", fontFamily: "Georgia, serif" }}
          >
            Nothing yet. What are you
            <br />
            looking forward to?
          </p>
          <button
            onClick={onAddClick}
            className="rounded-xl px-6 py-2.5 text-sm font-medium"
            style={{ background: "#FDE68A", color: "#92400E" }}
          >
            Add something
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((event) => (
            <EventPill
              key={event.id}
              event={event}
              onDelete={onDeleteEvent}
            />
          ))}
          <button
            onClick={onAddClick}
            className="mt-2 rounded-xl py-2 text-sm font-medium text-center"
            style={{ background: "#F5EFE6", color: "#B0A090" }}
          >
            + add more
          </button>
        </div>
      )}
    </div>
  );
}
