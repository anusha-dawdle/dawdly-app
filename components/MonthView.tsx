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

export default function MonthView({ anchor, getEventsForDate, onDayClick }: MonthViewProps) {
  const monthStart = startOfMonth(anchor);
  const days = getDaysInMonth(anchor);
  const firstDay = new Date(monthStart + "T12:00:00").getDay();
  const cells: (string | null)[] = [...Array(firstDay).fill(null), ...days];

  return (
    <div className="flex flex-col h-full px-4 pb-4" style={{ background: "var(--paper)" }}>

      {/* Handwriting heading */}
      <div className="pt-4 pb-1 text-center">
        <span style={{
          fontFamily: "var(--font-hand)",
          fontSize: 36,
          color: "var(--accent)",
          letterSpacing: "0.01em",
        }}>
          {formatMonthYear(anchor)}
        </span>
        {/* Underline flourish */}
        <svg width="160" height="10" viewBox="0 0 160 10" className="block mx-auto mt-0.5" fill="none">
          <path d="M4 6 Q40 2 80 6 Q120 10 156 5" stroke="var(--marker)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
        </svg>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1 mt-2">
        {WEEKDAY_LABELS.map((w) => (
          <div
            key={w}
            className="text-center py-1"
            style={{
              fontFamily: "var(--font-hand)",
              fontSize: 13,
              color: "var(--ink-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day grid with warm gridlines */}
      <div
        className="grid grid-cols-7 flex-1"
        style={{
          border: "1px solid rgba(180,100,60,0.15)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {cells.map((day, i) => {
          const isLastRow = i >= cells.length - 7;
          const isLastCol = i % 7 === 6;

          if (!day) {
            return (
              <div
                key={`empty-${i}`}
                style={{
                  borderRight: isLastCol ? "none" : "1px solid rgba(180,100,60,0.12)",
                  borderBottom: isLastRow ? "none" : "1px solid rgba(180,100,60,0.12)",
                  background: "rgba(180,140,90,0.03)",
                }}
              />
            );
          }

          const events = getEventsForDate(day);
          const todayDay = isToday(day);
          const dayNum = parseInt(day.split("-")[2]);
          const visible = events.slice(0, 2);
          const overflow = events.length - visible.length;

          return (
            <button
              key={day}
              onClick={() => onDayClick(day)}
              className="flex flex-col text-left transition-colors hover:brightness-95"
              style={{
                background: todayDay ? "rgba(221,130,38,0.09)" : "transparent",
                borderRight: isLastCol ? "none" : "1px solid rgba(180,100,60,0.12)",
                borderBottom: isLastRow ? "none" : "1px solid rgba(180,100,60,0.12)",
                outline: todayDay ? "inset 0 0 0 1.5px rgba(221,130,38,0.4)" : "none",
                minHeight: 72,
                padding: "6px 5px 4px",
              }}
            >
              {/* Day number */}
              <span style={{
                fontFamily: "var(--font-hand)",
                fontSize: 15,
                fontWeight: todayDay ? 600 : 400,
                color: todayDay ? "var(--accent)" : "var(--ink)",
                lineHeight: 1,
                marginBottom: 4,
              }}>
                {dayNum}
              </span>

              {/* Charm thumbnails */}
              <div className="flex flex-col gap-0.5 w-full">
                {visible.map((event) => (
                  <div key={event.id} className="flex items-center gap-1 min-w-0">
                    <CharmIcon charmId={event.charmId} size={22} />
                    <span
                      className="truncate"
                      style={{
                        fontFamily: "var(--font-hand)",
                        fontSize: 12,
                        color: "var(--ink-muted)",
                        lineHeight: 1.2,
                      }}
                    >
                      {event.title}
                    </span>
                  </div>
                ))}
                {overflow > 0 && (
                  <span style={{ fontFamily: "var(--font-hand)", fontSize: 12, color: "var(--ink-faint)" }}>
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
