"use client";

import type { DawdlyEvent } from "@/lib/types";
import {
  getDaysInMonth,
  startOfMonth,
  formatMonthYear,
  isToday,
} from "@/lib/dates";
import CharmIcon from "./CharmIcon";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MonthViewProps {
  anchor: string;
  getEventsForDate: (date: string) => DawdlyEvent[];
  onDayClick: (date: string) => void;
}

export default function MonthView({
  anchor,
  getEventsForDate,
  onDayClick,
}: MonthViewProps) {
  const monthStart = startOfMonth(anchor);
  const days = getDaysInMonth(anchor);
  const firstDay = new Date(monthStart + "T12:00:00").getDay();

  const cells: (string | null)[] = [
    ...Array(firstDay).fill(null),
    ...days,
  ];

  return (
    <div className="flex flex-col h-full px-4 pb-4">
      {/* Heading — matches week view style */}
      <div className="pt-3 pb-2 text-center">
        <span
          className="text-3xl font-semibold"
          style={{ color: "#7C3D1A", fontFamily: "Georgia, serif" }}
        >
          {formatMonthYear(anchor)}
        </span>
      </div>

      {/* Weekday column labels */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((w) => (
          <div
            key={w}
            className="text-center text-xs font-medium py-1 uppercase tracking-wide"
            style={{ color: "#B0A090" }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 flex-1" style={{ gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const events = getEventsForDate(day);
          const todayDay = isToday(day);
          const dayNum = parseInt(day.split("-")[2]);
          const visible = events.slice(0, 2);
          const overflow = events.length - visible.length;

          return (
            <button
              key={day}
              onClick={() => onDayClick(day)}
              className="flex flex-col rounded-xl p-1.5 transition-colors text-left"
              style={{
                background: todayDay ? "#FFFBEF" : "transparent",
                border: todayDay ? "1.5px solid #FDE68A" : "1.5px solid transparent",
                minHeight: 80,
              }}
            >
              {/* Day number */}
              <span
                className="text-xs font-semibold mb-1 w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  color: todayDay ? "#D97706" : "#7C3D1A",
                  background: todayDay ? "#FEF3C7" : "transparent",
                }}
              >
                {dayNum}
              </span>

              {/* Events: charm + truncated title */}
              <div className="flex flex-col gap-0.5 w-full">
                {visible.map((event) => (
                  <div key={event.id} className="flex items-center gap-1 w-full min-w-0">
                    <CharmIcon charmId={event.charmId} size={18} />
                    <span
                      className="truncate"
                      style={{ color: "#7C3D1A", fontSize: 10, lineHeight: "14px" }}
                    >
                      {event.title}
                    </span>
                  </div>
                ))}
                {overflow > 0 && (
                  <span style={{ color: "#B0A090", fontSize: 10 }}>
                    +{overflow} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
