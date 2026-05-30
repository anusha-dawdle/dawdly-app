"use client";

import type { DawdlyEvent } from "@/lib/types";
import { formatDayHeader, formatMonthYear, isToday } from "@/lib/dates";
import CharmIcon from "./CharmIcon";

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
  const monthLabel = formatMonthYear(date);
  const events = getEventsForDate(date);
  const todayDay = isToday(date);

  return (
    <div className="flex flex-col h-full">
      {/* Heading — matches week view style */}
      <div className="pt-3 pb-1 text-center">
        <span
          className="text-3xl font-semibold"
          style={{ color: "#7C3D1A", fontFamily: "Georgia, serif" }}
        >
          {monthLabel}
        </span>
      </div>

      {/* Day hero */}
      <div className="px-8 pt-3 pb-5">
        <p
          className="text-sm uppercase tracking-widest font-medium"
          style={{ color: todayDay ? "#D97706" : "#B0A090" }}
        >
          {weekday}
        </p>
        <p
          className="text-7xl font-bold leading-none"
          style={{
            color: todayDay ? "#D97706" : "#7C3D1A",
            fontFamily: "Georgia, serif",
          }}
        >
          {day}
        </p>
      </div>

      {/* Events */}
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
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex flex-col gap-2">
            {events.map((event) => (
              <DayEventCard
                key={event.id}
                event={event}
                onDelete={onDeleteEvent}
              />
            ))}
            <button
              onClick={onAddClick}
              className="mt-1 rounded-xl py-2.5 text-sm font-medium text-center"
              style={{ background: "#F5EFE6", color: "#B0A090" }}
            >
              + add more
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DayEventCard({
  event,
  onDelete,
}: {
  event: DawdlyEvent;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="group flex items-center gap-4 rounded-2xl px-4 py-3"
      style={{ background: "#FFF8F0", border: "1.5px solid #F0EBE0" }}
    >
      <CharmIcon charmId={event.charmId} size={56} />
      <div className="flex-1 min-w-0">
        <p
          className="text-base font-semibold leading-snug"
          style={{ color: "#7C3D1A", fontFamily: "Georgia, serif" }}
        >
          {event.title}
        </p>
        {event.startTime && (
          <p className="text-sm mt-0.5" style={{ color: "#B0A090" }}>
            {formatTime(event.startTime)}
          </p>
        )}
        {event.note && (
          <p className="text-sm mt-1 italic" style={{ color: "#B0A090" }}>
            {event.note}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(event.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0"
        style={{ color: "#B0A090", background: "#F0EBE0", fontSize: 14 }}
        title="Remove"
      >
        ×
      </button>
    </div>
  );
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}
