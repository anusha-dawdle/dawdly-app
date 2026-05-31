"use client";

import type { DawdlyEvent } from "@/lib/types";
import {
  getWeekDays,
  formatDayHeader,
  isToday,
  formatMonthYear,
  relativeDate,
} from "@/lib/dates";
import CharmIcon from "./CharmIcon";

interface WeekViewProps {
  anchor: string;
  events: DawdlyEvent[];
  getEventsForDate: (date: string) => DawdlyEvent[];
  onDayClick: (date: string) => void;
  onDeleteEvent: (id: string) => void;
  onEventClick: (event: DawdlyEvent) => void;
}


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

export default function WeekView({
  anchor,
  events,
  getEventsForDate,
  onDayClick,
  onDeleteEvent,
  onEventClick,
}: WeekViewProps) {
  const days = getWeekDays(anchor);
  const weekEnd = days[6];
  const horizonEvents = events
    .filter((e) => e.date > weekEnd)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 12);

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--paper)" }}>

      {/* Month heading */}
      <div className="text-center pt-4 pb-1 flex-shrink-0">
        <span style={{
          fontFamily: "var(--font-hand)",
          fontSize: 26,
          color: "var(--accent)",
          letterSpacing: "0.01em",
        }}>
          {formatMonthYear(days[0])}
        </span>
      </div>

      {/* Day columns */}
      <div className="flex flex-1 px-3 pb-2 overflow-hidden" style={{ minHeight: 0 }}>
        {days.map((day, i) => {
          const { weekday, day: dayNum } = formatDayHeader(day);
          const dayEvents = getEventsForDate(day);
          const todayDay = isToday(day);

          return (
            <div key={day} className="flex flex-1 min-w-0">
              {/* Dashed divider */}
              {i > 0 && (
                <div style={{
                  width: 1,
                  flexShrink: 0,
                  borderLeft: "1.5px dashed",
                  borderColor: "rgba(180,140,90,0.25)",
                  margin: "8px 0",
                }} />
              )}

              <div
                className="group/col flex-1 flex flex-col min-w-0 rounded-2xl"
                style={{
                  background: todayDay ? "rgba(221,130,38,0.07)" : "transparent",
                  outline: todayDay ? "1.5px solid rgba(221,130,38,0.35)" : "none",
                  outlineOffset: -1,
                }}
              >
                {/* Day header */}
                <button
                  onClick={() => onDayClick(day)}
                  className="flex flex-col items-center pt-3 pb-2 w-full hover:opacity-70 transition-opacity"
                >
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: todayDay ? "var(--accent)" : "var(--ink-faint)",
                  }}>
                    {weekday}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 22,
                    fontWeight: todayDay ? 700 : 500,
                    color: todayDay ? "var(--accent)" : "var(--ink)",
                    lineHeight: 1.1,
                  }}>
                    {dayNum}
                  </span>
                </button>

                {/* Events as scrapbook cards */}
                <div className="flex-1 flex flex-col gap-0 px-0.5 pb-1 overflow-y-auto items-center">
                  {dayEvents.length === 0 && (
                    <button
                      onClick={() => onDayClick(day)}
                      className="w-full mt-1 rounded-xl py-1 opacity-0 group-hover/col:opacity-100 transition-opacity text-center"
                      style={{ fontSize: 12, color: "var(--ink-faint)", fontFamily: "var(--font-hand)" }}
                    >
                      + add
                    </button>
                  )}
                  {dayEvents.map((event, idx) => {
                    if (event.kind === "work") {
                      return (
                        <WorkEventRow
                          key={event.id}
                          event={event}
                          onDelete={onDeleteEvent}
                          onClick={onEventClick}
                        />
                      );
                    }
                    const col = cardColor(event.id);
                    return (
                      <WeekEventCard
                        key={event.id}
                        event={event}
                        bg={col.bg}
                        ink={col.ink}
                        onDelete={onDeleteEvent}
                        onClick={onEventClick}
                        onAdd={() => onDayClick(day)}
                        iconSize={160}
                        overlap={idx > 0}
                        zIndex={dayEvents.length - idx}
                      />
                    );
                  })}
                  {dayEvents.length > 0 && (
                    <button
                      onClick={() => onDayClick(day)}
                      className="mt-0.5 rounded-lg px-3 py-0.5 opacity-0 group-hover/col:opacity-80 transition-opacity"
                      style={{ fontSize: 12, color: "var(--ink-faint)", fontFamily: "var(--font-hand)", background: "rgba(180,140,90,0.1)" }}
                    >
                      + add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* On the horizon */}
      <div className="flex-shrink-0" style={{ borderTop: "1.5px dashed rgba(180,140,90,0.3)" }}>
        {horizonEvents.length > 0 ? (
          <div className="px-5 pt-3 pb-4">
            <p style={{
              fontFamily: "var(--font-hand)",
              fontSize: 17,
              color: "var(--ink-muted)",
              marginBottom: 8,
              fontStyle: "italic",
            }}>
              on the horizon
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {horizonEvents.map((event) => {
                if (event.kind === "work") {
                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-2 rounded-xl px-3 py-1.5 flex-shrink-0"
                      style={{
                        borderLeft: "3px solid rgba(120,110,100,0.35)",
                        background: "rgba(180,140,90,0.06)",
                      }}
                    >
                      <div className="flex flex-col">
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap" }}>
                          {event.title}
                        </span>
                        <span style={{ fontFamily: "var(--font-hand)", fontSize: 12, color: "var(--ink-faint)", whiteSpace: "nowrap" }}>
                          {relativeDate(event.date)}
                        </span>
                      </div>
                    </div>
                  );
                }
                const col = cardColor(event.id);
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 flex-shrink-0"
                    style={{
                      background: col.bg,
                      boxShadow: "var(--shadow-warm)",
                    }}
                  >
                    <CharmIcon charmId={event.charmId} size={26} />
                    <div className="flex flex-col">
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: col.ink, whiteSpace: "nowrap" }}>
                        {event.title}
                      </span>
                      <span style={{ fontFamily: "var(--font-hand)", fontSize: 13, color: "var(--ink-muted)", whiteSpace: "nowrap" }}>
                        {relativeDate(event.date)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="px-5 py-3" style={{ fontFamily: "var(--font-hand)", fontSize: 15, color: "var(--ink-faint)", fontStyle: "italic" }}>
            nothing on the horizon yet — add something to look forward to ♡
          </p>
        )}
      </div>

    </div>
  );
}

function WorkEventRow({
  event,
  onDelete,
  onClick,
}: {
  event: DawdlyEvent;
  onDelete: (id: string) => void;
  onClick: (event: DawdlyEvent) => void;
}) {
  return (
    <div
      className="group relative w-full cursor-pointer"
      onClick={() => onClick(event)}
      style={{
        borderLeft: "2px solid rgba(91,110,122,0.45)",
        paddingLeft: 5,
        paddingTop: 3,
        paddingBottom: 3,
        marginTop: 6,
        marginBottom: 2,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-hand)",
          fontSize: 13,
          color: "#5B6E7A",
          lineHeight: 1.3,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {event.title}
      </p>
      {event.startTime && (
        <p style={{ fontFamily: "var(--font-hand)", fontSize: 11, color: "#8BA0AB", marginTop: 1 }}>
          {formatTime(event.startTime)}
        </p>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-4 h-4 flex items-center justify-center"
        style={{ background: "rgba(74,61,49,0.1)", color: "var(--ink-faint)", fontSize: 11 }}
        title="Remove"
      >
        ×
      </button>
    </div>
  );
}

function WeekEventCard({
  event,
  bg,
  ink,
  onDelete,
  onClick,
  iconSize = 160,
  overlap = false,
  zIndex = 1,
}: {
  event: DawdlyEvent;
  bg: string;
  ink: string;
  onDelete: (id: string) => void;
  onClick: (event: DawdlyEvent) => void;
  onAdd: () => void;
  iconSize?: number;
  overlap?: boolean;
  zIndex?: number;
}) {
  return (
    <div
      className="group relative flex flex-col items-center w-full cursor-pointer"
      onClick={() => onClick(event)}
      style={{
        marginTop: overlap ? -16 : 4,
        paddingBottom: 2,
        position: "relative",
        zIndex,
      }}
    >
      <CharmIcon charmId={event.charmId} size={iconSize} />
      <p
        className="text-center w-full"
        style={{
          fontFamily: "var(--font-hand)",
          fontSize: 13,
          color: ink,
          lineHeight: 1.2,
          marginTop: 4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          paddingInline: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        {event.title}
      </p>
      {event.startTime && (
        <p style={{ fontFamily: "var(--font-hand)", fontSize: 12, color: "var(--ink-faint)", marginTop: 0, position: "relative", zIndex: 1 }}>
          {formatTime(event.startTime)}
        </p>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-4 h-4 flex items-center justify-center"
        style={{ background: "rgba(74,61,49,0.15)", color: "var(--ink-muted)", fontSize: 12, lineHeight: 1 }}
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
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}
