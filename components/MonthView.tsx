"use client";

import type { DawdlyEvent } from "@/lib/types";
import {
  getDaysInMonth,
  startOfMonth,
  formatMonthYear,
  isToday,
  isSameMonth,
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
  const firstDay = new Date(monthStart + "T12:00:00").getDay(); // 0=Sun offset

  // Pad with empty slots for the first week
  const cells: (string | null)[] = [
    ...Array(firstDay).fill(null),
    ...days,
  ];

  return (
    <div className="flex flex-col h-full px-4 pb-4">
      <div className="px-2 pt-2 pb-3">
        <span
          className="text-lg font-semibold"
          style={{ color: "#2D2017", fontFamily: "Georgia, serif" }}
        >
          {formatMonthYear(anchor)}
        </span>
      </div>

      {/* Weekday headers */}
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
      <div className="grid grid-cols-7 flex-1 gap-px">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const events = getEventsForDate(day);
          const todayDay = isToday(day);
          const dayNum = parseInt(day.split("-")[2]);

          return (
            <button
              key={day}
              onClick={() => onDayClick(day)}
              className="flex flex-col rounded-xl p-1 transition-colors text-left"
              style={{
                background: todayDay ? "#FFFBEF" : "transparent",
                border: todayDay ? "1.5px solid #FDE68A" : "1.5px solid transparent",
                minHeight: 72,
              }}
            >
              <span
                className="text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                style={{
                  color: todayDay ? "#D97706" : "#2D2017",
                  background: todayDay ? "#FEF3C7" : "transparent",
                }}
              >
                {dayNum}
              </span>
              <div className="flex flex-wrap gap-0.5">
                {events.slice(0, 4).map((event) => (
                  <CharmIcon
                    key={event.id}
                    charmId={event.charmId}
                    size={22}
                  />
                ))}
                {events.length > 4 && (
                  <span
                    className="text-xs"
                    style={{ color: "#B0A090", lineHeight: "22px" }}
                  >
                    +{events.length - 4}
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
