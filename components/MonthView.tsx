"use client";

import type { DawdlyEvent } from "@/lib/types";
import type { Breakpoint } from "@/lib/breakpoint";
import {
  getDaysInMonth,
  startOfMonth,
  formatMonthYear,
  isToday,
} from "@/lib/dates";
import CharmIcon from "./CharmIcon";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_LABELS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

const CARD_COLORS = [
  { bg: "var(--card-sage)",   ink: "var(--card-sage-ink)" },
  { bg: "var(--card-pink)",   ink: "var(--card-pink-ink)" },
  { bg: "var(--card-butter)", ink: "var(--card-butter-ink)" },
  { bg: "var(--card-mint)",   ink: "var(--card-mint-ink)" },
];

function cardColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return CARD_COLORS[Math.abs(h) % CARD_COLORS.length];
}

interface MonthViewProps {
  anchor: string;
  getEventsForDate: (date: string) => DawdlyEvent[];
  onDayClick: (date: string) => void;
  breakpoint: Breakpoint;
}

export default function MonthView({ anchor, getEventsForDate, onDayClick, breakpoint }: MonthViewProps) {
  const isMobile = breakpoint === "mobile";
  const monthStart = startOfMonth(anchor);
  const days = getDaysInMonth(anchor);
  const firstDay = new Date(monthStart + "T12:00:00").getDay();
  const cells: (string | null)[] = [...Array(firstDay).fill(null), ...days];
  const labels = isMobile ? WEEKDAY_LABELS_SHORT : WEEKDAY_LABELS;

  return (
    <div className="flex flex-col h-full pb-4" style={{ background: "var(--paper)", paddingLeft: isMobile ? 8 : 16, paddingRight: isMobile ? 8 : 16 }}>

      {/* Month heading */}
      <div className="pt-4 pb-1 text-center">
        <span style={{
          fontFamily: "var(--font-hand)",
          fontSize: isMobile ? 20 : 26,
          color: "var(--accent)",
          letterSpacing: "0.01em",
        }}>
          {formatMonthYear(anchor)}
        </span>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1 mt-2">
        {labels.map((w, i) => (
          <div
            key={i}
            className="text-center py-1"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: isMobile ? 11 : 12,
              fontWeight: 600,
              color: "var(--ink-faint)",
              letterSpacing: "0.04em",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
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

          const allEvents = getEventsForDate(day);
          const personalEvents = allEvents.filter((e) => e.kind !== "work");
          const workEvents = allEvents.filter((e) => e.kind === "work");
          // Desktop: charms for personal only. Mobile: dots for personal, pills for work.
          const visiblePersonal = personalEvents.slice(0, isMobile ? 3 : 3);
          const visibleWork = isMobile ? workEvents.slice(0, 2) : [];
          const todayDay = isToday(day);
          const dayNum = parseInt(day.split("-")[2]);
          const desktopOverflow = personalEvents.length - visiblePersonal.length;

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
                minHeight: isMobile ? 56 : 72,
                padding: isMobile ? "4px 3px 3px" : "6px 5px 4px",
              }}
            >
              {/* Hover add button */}
              {!isMobile && (
                <span
                  className="absolute inset-x-1 bottom-1 opacity-0 group-hover/day:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none"
                  style={{ background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-hand)", paddingTop: 3, paddingBottom: 3 }}
                >
                  + add
                </span>
              )}

              {/* Day number */}
              <span style={{
                fontFamily: "var(--font-hand)",
                fontSize: isMobile ? 12 : 15,
                fontWeight: todayDay ? 600 : 400,
                color: todayDay ? "var(--accent)" : "var(--ink)",
                lineHeight: 1,
                marginBottom: isMobile ? 2 : 4,
              }}>
                {dayNum}
              </span>

              {isMobile ? (
                /* Mobile: dots for personal, pills for work */
                <div className="flex flex-col gap-0.5 w-full">
                  {visiblePersonal.length > 0 && (
                    <div className="flex gap-0.5 flex-wrap">
                      {visiblePersonal.map((event) => {
                        const col = cardColor(event.id);
                        return (
                          <div
                            key={event.id}
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: col.bg,
                              border: `1.5px solid ${col.ink}`,
                              flexShrink: 0,
                            }}
                          />
                        );
                      })}
                      {personalEvents.length > 3 && (
                        <span style={{ fontSize: 8, color: "var(--ink-faint)", lineHeight: "7px" }}>+{personalEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                  {visibleWork.map((event) => (
                    <div
                      key={event.id}
                      style={{
                        background: "rgba(74,61,49,0.08)",
                        borderRadius: 3,
                        padding: "1px 3px",
                        overflow: "hidden",
                      }}
                    >
                      <span style={{
                        fontFamily: "var(--font-hand)",
                        fontSize: 9,
                        color: "var(--ink)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}>
                        {event.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                /* Desktop/tablet: charm icons */
                <div className="flex flex-wrap gap-0.5">
                  {visiblePersonal.map((event) => (
                    <CharmIcon key={event.id} charmId={event.charmId} size={64} />
                  ))}
                  {desktopOverflow > 0 && (
                    <span className="flex items-center" style={{ fontFamily: "var(--font-hand)", fontSize: 11, color: "var(--ink-faint)" }}>
                      +{desktopOverflow}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
