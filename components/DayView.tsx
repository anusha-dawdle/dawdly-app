"use client";

import type { DawdlyEvent } from "@/lib/types";
import { formatDayHeader, formatMonthYear, isToday, relativeDate, today } from "@/lib/dates";
import CharmIcon from "./CharmIcon";

interface DayViewProps {
  date: string;
  getEventsForDate: (date: string) => DawdlyEvent[];
  onAddClick: () => void;
  onDeleteEvent: (id: string) => void;
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

function tilt(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return ((h % 7) - 3) * 0.45; // ±1.35°
}

export default function DayView({ date, getEventsForDate, onAddClick, onDeleteEvent }: DayViewProps) {
  const { weekday, day } = formatDayHeader(date);
  const monthLabel = formatMonthYear(date);
  const events = getEventsForDate(date);
  const todayDay = isToday(date);
  const isUpcoming = date > today();
  const countdown = isUpcoming ? relativeDate(date) : null;

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--paper)" }}>

      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-5 pb-4" style={{ borderBottom: "1.5px dashed rgba(180,140,90,0.3)" }}>
        <p style={{ fontFamily: "var(--font-hand)", fontSize: 18, color: "var(--ink-muted)" }}>
          {monthLabel}
        </p>
        <div className="flex items-baseline gap-3 mt-0.5">
          <p style={{
            fontFamily: "var(--font-serif)",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1,
            color: todayDay ? "var(--accent)" : "var(--ink)",
          }}>
            {day}
          </p>
          <div className="flex flex-col">
            <p style={{
              fontFamily: "var(--font-hand)",
              fontSize: 22,
              color: todayDay ? "var(--accent)" : "var(--ink-muted)",
            }}>
              {weekday}
            </p>
            {countdown && (
              <p style={{ fontFamily: "var(--font-hand)", fontSize: 16, color: "var(--marker)", fontStyle: "italic" }}>
                {countdown}
              </p>
            )}
            {todayDay && (
              <p style={{ fontFamily: "var(--font-hand)", fontSize: 14, color: "var(--accent)", fontStyle: "italic" }}>
                today ♡
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-60">
            <p style={{ fontFamily: "var(--font-hand)", fontSize: 20, color: "var(--ink-muted)", textAlign: "center" }}>
              nothing yet —<br />add something to look forward to ♡
            </p>
            <button
              onClick={onAddClick}
              className="rounded-xl px-6 py-2.5"
              style={{ background: "var(--card-butter)", color: "var(--card-butter-ink)", fontFamily: "var(--font-hand)", fontSize: 16 }}
            >
              + add something
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-lg mx-auto">
            {events.map((event) => (
              <DayEventCard
                key={event.id}
                event={event}
                onDelete={onDeleteEvent}
              />
            ))}
            <button
              onClick={onAddClick}
              className="rounded-xl py-3 text-center"
              style={{
                background: "rgba(180,140,90,0.1)",
                border: "1.5px dashed rgba(180,140,90,0.35)",
                fontFamily: "var(--font-hand)",
                fontSize: 16,
                color: "var(--ink-faint)",
              }}
            >
              + add more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DayEventCard({ event, onDelete }: { event: DawdlyEvent; onDelete: (id: string) => void }) {
  const col = cardColor(event.id);
  const deg = tilt(event.id);

  return (
    <div
      className="group relative flex items-center gap-5 rounded-2xl px-5 py-4"
      style={{
        background: col.bg,
        transform: `rotate(${deg}deg)`,
        boxShadow: "0 3px 14px rgba(74,61,49,0.13), 0 1px 4px rgba(74,61,49,0.08)",
      }}
    >
      {/* Polaroid-style charm frame */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-xl"
        style={{
          background: "rgba(255,255,255,0.55)",
          padding: 6,
          boxShadow: "0 1px 6px rgba(74,61,49,0.1)",
        }}
      >
        <CharmIcon charmId={event.charmId} size={72} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p style={{
          fontFamily: "var(--font-serif)",
          fontSize: 20,
          fontWeight: 600,
          color: col.ink,
          lineHeight: 1.2,
        }}>
          {event.title}
        </p>
        {event.startTime && (
          <p style={{ fontFamily: "var(--font-hand)", fontSize: 16, color: "var(--ink-muted)", marginTop: 3 }}>
            {formatTime(event.startTime)}
          </p>
        )}
        {event.note && (
          <p style={{
            fontFamily: "var(--font-hand)",
            fontSize: 14,
            color: "var(--ink-muted)",
            fontStyle: "italic",
            marginTop: 4,
            lineHeight: 1.35,
          }}>
            {event.note}
          </p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(event.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-5 h-5 flex items-center justify-center"
        style={{ background: "rgba(74,61,49,0.12)", color: "var(--ink-muted)", fontSize: 13 }}
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
