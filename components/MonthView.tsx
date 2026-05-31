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

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

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

      {/* Month heading */}
      <div className="pt-4 pb-1 text-center">
        <span style={{
          fontFamily: "var(--font-hand)",
          fontSize: 26,
          color: "var(--accent)",
          letterSpacing: "0.01em",
        }}>
          {formatMonthYear(anchor)}
        </span>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1 mt-2">
        {WEEKDAY_LABELS.map((w) => (
          <div
            key={w}
            className="text-center py-1"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--ink-faint)",
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
          const visible = events.slice(0, 3);
          const overflow = events.length - visible.length;

          return (
            <button
              key={day}
              onClick={() => onDayClick(day)}
              className="group/day flex flex-col text-left transition-colors hover:brightness-95 relative"
              style={{
                background: todayDay ? "rgba(221,130,38,0.09)" : "transparent",
                borderRight: isLastCol ? "none" : "1px solid rgba(180,100,60,0.12)",
                borderBottom: isLastRow ? "none" : "1px solid rgba(180,100,60,0.12)",
                outline: todayDay ? "inset 0 0 0 1.5px rgba(221,130,38,0.4)" : "none",
                minHeight: 72,
                padding: "6px 5px 4px",
              }}
            >
              {/* Hover + button */}
              <span
                className="absolute inset-x-1 bottom-1 opacity-0 group-hover/day:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none"
                style={{ background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-hand)", paddingTop: 3, paddingBottom: 3 }}
              >
                + add
              </span>

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

              {/* Event indicators */}
              <div className="flex flex-col gap-0.5 w-full">
                {visible.map((event) =>
                  event.kind === "work" ? (
                    <div
                      key={event.id}
                      className="flex items-center gap-1 w-full"
                      style={{ borderLeft: "2px solid rgba(120,110,100,0.3)", paddingLeft: 3 }}
                    >
                      <span style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 10,
                        fontWeight: 500,
                        color: "var(--ink-muted)",
                        lineHeight: 1.2,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        display: "block",
                        maxWidth: "100%",
                      }}>
                        {event.startTime ? `${formatTime(event.startTime)} ` : ""}{event.title}
                      </span>
                    </div>
                  ) : (
                    <CharmIcon key={event.id} charmId={event.charmId} size={64} />
                  )
                )}
                {overflow > 0 && (
                  <span className="flex items-center" style={{ fontFamily: "var(--font-hand)", fontSize: 11, color: "var(--ink-faint)" }}>
                    +{overflow}
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
