"use client";

import { useRef, useEffect, useState } from "react";
import type { DawdlyEvent } from "@/lib/types";
import type { Breakpoint } from "@/lib/breakpoint";
import {
  getWeekDays,
  formatDayHeader,
  isToday,
  formatMonthYear,
  relativeDate,
  addDays,
} from "@/lib/dates";
import CharmIcon from "./CharmIcon";

// ─── Layout constants ─────────────────────────────────────────────────────────
const PX_PER_HOUR = 56;
const TOTAL_H = 24 * PX_PER_HOUR; // 1344 px
const TIME_COL_W = 44;
const STICKER_W = 84;   // default px for personal charm stickers
const STICKER_STEP = 8;

// ─── Time helpers ─────────────────────────────────────────────────────────────
function timeToY(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h + m / 60) * PX_PER_HOUR;
}

function formatHour(h: number): string {
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  return h < 12 ? `${h}a` : `${h - 12}p`;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "pm" : "am"}`;
}

function formatDuration(startTime: string, endTime: string, startDate: string, endDate: string): string {
  const toMins = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  let mins = toMins(endTime) - toMins(startTime);
  if (endDate > startDate || mins < 0) mins += 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ─── Deterministic sticker aesthetics ────────────────────────────────────────
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Stable x-offset: -16 to +16 px from column centre
function stickerXOffset(id: string): number {
  return (hashId(id) % 33) - 16;
}

// Stable rotation: -8 to +8 degrees
function stickerRotation(id: string): number {
  return (hashId(id + "r") % 17) - 8;
}

// ─── Card colours ─────────────────────────────────────────────────────────────
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

// ─── Work event lane layout ───────────────────────────────────────────────────
type WorkPlaced = {
  event: DawdlyEvent;
  top: number;
  height: number;
  col: number;
  totalCols: number;
  isContinuation: boolean;
};

function placeWorkEvents(allEvents: DawdlyEvent[], dayDate: string): WorkPlaced[] {
  const items: { event: DawdlyEvent; top: number; bottom: number; isCont: boolean }[] = [];

  for (const e of allEvents) {
    if (e.kind !== "work") continue;
    if (e.date === dayDate) {
      const top = timeToY(e.startTime);
      const rawBot = e.endDate === dayDate ? timeToY(e.endTime) : TOTAL_H;
      items.push({ event: e, top, bottom: Math.max(top + 22, Math.min(rawBot, TOTAL_H)), isCont: false });
    } else if (e.endDate === dayDate) {
      const bottom = Math.max(22, Math.min(timeToY(e.endTime), TOTAL_H));
      items.push({ event: e, top: 0, bottom, isCont: true });
    }
  }

  items.sort((a, b) => a.top - b.top);

  const colBottoms: number[] = [];
  const colIdxs: number[] = new Array(items.length).fill(0);
  for (let i = 0; i < items.length; i++) {
    const c = colBottoms.findIndex((bot) => bot <= items[i].top + 1);
    if (c === -1) { colIdxs[i] = colBottoms.length; colBottoms.push(items[i].bottom); }
    else { colIdxs[i] = c; colBottoms[c] = items[i].bottom; }
  }

  return items.map((item, i) => {
    let maxCol = colIdxs[i];
    for (let j = 0; j < items.length; j++) {
      if (j !== i && items[j].top < item.bottom && items[j].bottom > item.top) {
        maxCol = Math.max(maxCol, colIdxs[j]);
      }
    }
    return {
      event: item.event,
      top: item.top,
      height: item.bottom - item.top,
      col: colIdxs[i],
      totalCols: maxCol + 1,
      isContinuation: item.isCont,
    };
  });
}

// ─── Sticker override (persisted per-event customisation) ────────────────────
type StickerOverride = { size: number; dx: number; dy: number; rotation: number };

// ─── Personal sticker placement ───────────────────────────────────────────────
type StickerPlaced = {
  event: DawdlyEvent;
  anchorY: number;  // timeToY(startTime) — sticker centred here
  xOffset: number;  // px from column centre
  rotation: number; // degrees
  zIndex: number;
};

function placePersonalStickers(allEvents: DawdlyEvent[], dayDate: string): StickerPlaced[] {
  const personal = allEvents.filter((e) => e.kind !== "work" && e.date === dayDate);
  personal.sort((a, b) => a.startTime.localeCompare(b.startTime));

  return personal.map((event, idx) => ({
    event,
    anchorY: timeToY(event.startTime),
    xOffset: stickerXOffset(event.id),
    rotation: stickerRotation(event.id),
    zIndex: 5 + idx,
  }));
}

// ─── PersonalCharmSticker ─────────────────────────────────────────────────────
function PersonalCharmSticker({
  placed,
  size, dx, dy, rotation,
  onUpdate,
  onShowDetail,
  onDeleteEvent,
}: {
  placed: StickerPlaced;
  size: number;
  dx: number;
  dy: number;
  rotation: number;
  onUpdate: (patch: Partial<StickerOverride>) => void;
  onShowDetail: (event: DawdlyEvent, x: number, y: number) => void;
  onDeleteEvent: (id: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const charmRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; startDx: number; startDy: number; moved: boolean } | null>(null);
  const isRotating = useRef(false);
  const rotateRef = useRef<{ startAngle: number; startRotation: number } | null>(null);
  const { event, anchorY, xOffset, zIndex } = placed;

  function onDragPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startDx: dx, startDy: dy, moved: false };
    setIsDragging(true);
  }
  function onDragPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const deltaX = e.clientX - d.startX;
    const deltaY = e.clientY - d.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) d.moved = true;
    onUpdate({ dx: d.startDx + deltaX, dy: d.startDy + deltaY });
  }
  function onDragPointerUp(e: React.PointerEvent) {
    if (dragRef.current && !dragRef.current.moved) {
      const rect = charmRef.current?.getBoundingClientRect();
      onShowDetail(event, rect ? rect.right + 8 : e.clientX + 8, rect ? rect.top : e.clientY);
    }
    dragRef.current = null;
    setIsDragging(false);
  }

  function onRotatePointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    if (charmRef.current) {
      const rect = charmRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
      rotateRef.current = { startAngle, startRotation: rotation };
    }
    isRotating.current = true;
  }
  function onRotatePointerMove(e: React.PointerEvent) {
    if (!isRotating.current || !charmRef.current || !rotateRef.current) return;
    const rect = charmRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    const delta = angle - rotateRef.current.startAngle;
    onUpdate({ rotation: Math.round(rotateRef.current.startRotation + delta) });
  }
  function onRotatePointerUp(e: React.PointerEvent) {
    isRotating.current = false;
    rotateRef.current = null;
    e.stopPropagation();
  }

  const btnStyle: React.CSSProperties = {
    pointerEvents: "auto",
    width: 22, height: 22,
    background: "rgba(40,28,18,0.58)",
    color: "white",
    fontSize: 15,
    lineHeight: 1,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    backdropFilter: "blur(3px)",
  };

  return (
    <div
      className="group"
      style={{
        position: "absolute",
        top: anchorY - size / 2 + dy,
        left: "50%",
        transform: `translateX(calc(-50% + ${xOffset + dx}px))`,
        zIndex: isDragging ? 500 : zIndex,
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Charm area */}
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>

        {/* Charm icon — drag to move, undragged click opens edit */}
        <div
          ref={charmRef}
          onPointerDown={onDragPointerDown}
          onPointerMove={onDragPointerMove}
          onPointerUp={onDragPointerUp}
          style={{
            position: "absolute", inset: 0,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
            cursor: isDragging ? "grabbing" : "grab",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <CharmIcon charmId={event.charmId} size={size - 4} />
        </div>

        {/* Controls overlay — pointer-events:none on wrapper so empty areas
            pass through to the charm drag handler beneath */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            {/* Size row */}
            <div style={{ display: "flex", gap: 0 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onUpdate({ size: size - STICKER_STEP }); }}
                style={{ ...btnStyle, borderRadius: "4px 0 0 4px" }}
              >−</button>
              <button
                onClick={(e) => { e.stopPropagation(); onUpdate({ size: size + STICKER_STEP }); }}
                style={{ ...btnStyle, borderRadius: "0 4px 4px 0" }}
              >+</button>
            </div>

            {/* Rotation handle */}
            <div
              onPointerDown={onRotatePointerDown}
              onPointerMove={onRotatePointerMove}
              onPointerUp={onRotatePointerUp}
              onClick={(e) => e.stopPropagation()}
              style={{ ...btnStyle, borderRadius: 4, fontSize: 16, cursor: "grab", pointerEvents: "auto" }}
              title="drag to rotate"
            >↻</div>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={(e) => { e.stopPropagation(); onDeleteEvent(event.id); }}
          className="absolute opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-4 h-4 flex items-center justify-center"
          style={{ top: 0, right: 0, transform: "translate(35%, -35%)", background: "rgba(74,61,49,0.8)", color: "white", fontSize: 10, lineHeight: 1, zIndex: 30 }}
          title="Remove"
        >×</button>
      </div>

    </div>
  );
}

// ─── WorkEventBlock ───────────────────────────────────────────────────────────
function WorkEventBlock({
  placed,
  onEventClick,
  onDeleteEvent,
}: {
  placed: WorkPlaced;
  onEventClick: (e: DawdlyEvent) => void;
  onDeleteEvent: (id: string) => void;
}) {
  const { event, top, height, col, totalCols, isContinuation } = placed;
  const pct = 100 / totalCols;

  return (
    <div
      className="group absolute overflow-hidden cursor-pointer"
      onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
      style={{
        top,
        height,
        left: `calc(${col * pct}% + 2px)`,
        width: `calc(${pct}% - 4px)`,
        borderRadius: 6,
        background: "rgba(180,140,90,0.18)",
        borderLeft: "3px solid var(--accent)",
        boxShadow: "0 1px 3px rgba(74,61,49,0.10)",
        padding: "2px 5px",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {isContinuation && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--accent)", opacity: 0.35 }} />
      )}
      <p style={{
        fontFamily: "var(--font-hand)",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--ink)",
        lineHeight: 1.2,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: height >= 44 ? 2 : 1,
        WebkitBoxOrient: "vertical",
        textDecoration: event.done ? "line-through" : "none",
      }}>
        {event.title}
      </p>
      {height >= 32 && (
        <p style={{ fontFamily: "var(--font-hand)", fontSize: 10, color: "var(--ink-faint)", lineHeight: 1 }}>
          {formatTime(event.startTime)}
        </p>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDeleteEvent(event.id); }}
        className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-4 h-4 flex items-center justify-center"
        style={{ background: "rgba(74,61,49,0.15)", color: "var(--ink-muted)", fontSize: 10, lineHeight: 1 }}
        title="Remove"
      >×</button>
    </div>
  );
}

// ─── EventDetailCard ─────────────────────────────────────────────────────────
function formatDetailTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "pm" : "am"}`;
}

function EventDetailCard({
  event,
  x,
  y,
  onEdit,
  onDelete,
  onClose,
}: {
  event: DawdlyEvent;
  x: number;
  y: number;
  onEdit: (e: DawdlyEvent) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const col = cardColor(event.id);
  const CARD_W = 256;

  const [y1, m1, d1] = event.date.split("-").map(Number);
  const dateObj = new Date(y1, m1 - 1, d1);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateObj.getDay()];
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m1 - 1];
  const dateStr = `${weekday}, ${month} ${d1}`;
  const timeStr = `${formatDetailTime(event.startTime)} – ${formatDetailTime(event.endTime)}`;

  const left = Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 1200) - CARD_W - 12);
  const top = Math.max(8, Math.min(y, (typeof window !== "undefined" ? window.innerHeight : 800) - 220));

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 rounded-2xl overflow-hidden"
        style={{
          left,
          top,
          width: CARD_W,
          background: "var(--paper)",
          border: "1px solid rgba(180,140,90,0.2)",
          boxShadow: "0 8px 32px rgba(74,61,49,0.22), 0 2px 8px rgba(74,61,49,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colored header with charm + title */}
        <div className="flex items-start gap-3 px-4 py-3" style={{ background: col.bg }}>
          <CharmIcon charmId={event.charmId} size={44} className="flex-shrink-0 mt-0.5" />
          <p style={{
            fontFamily: "var(--font-serif)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--accent)",
            lineHeight: 1.25,
            flex: 1,
            minWidth: 0,
            paddingTop: 2,
          }}>
            {event.title}
          </p>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "rgba(74,61,49,0.12)", color: "var(--ink-muted)", fontSize: 14 }}
          >×</button>
        </div>

        {/* Body */}
        <div className="px-4 pt-3 pb-2 flex flex-col gap-1.5">
          <p style={{ fontFamily: "var(--font-hand)", fontSize: 13, color: "var(--ink-muted)" }}>
            {dateStr}
          </p>
          <p style={{ fontFamily: "var(--font-hand)", fontSize: 13, color: "var(--ink-muted)" }}>
            {timeStr}
          </p>
          {event.note && (
            <p style={{
              fontFamily: "var(--font-hand)",
              fontSize: 13,
              color: "var(--ink-muted)",
              fontStyle: "italic",
              lineHeight: 1.4,
              marginTop: 2,
            }}>
              {event.note}
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex gap-2 px-4 pb-4 pt-2"
          style={{ borderTop: "1px solid rgba(180,140,90,0.15)" }}
        >
          <button
            onClick={() => { onEdit(event); onClose(); }}
            className="flex-1 rounded-xl py-1.5"
            style={{ fontFamily: "var(--font-hand)", fontSize: 14, background: "var(--accent)", color: "#fff", fontWeight: 600 }}
          >
            edit
          </button>
          <button
            onClick={() => { onDelete(event.id); onClose(); }}
            className="px-4 py-1.5 rounded-xl"
            style={{ fontFamily: "var(--font-hand)", fontSize: 14, background: "rgba(180,140,90,0.12)", color: "var(--ink-muted)" }}
          >
            delete
          </button>
        </div>
      </div>
    </>
  );
}

// ─── WeekView ─────────────────────────────────────────────────────────────────
interface WeekViewProps {
  anchor: string;
  events: DawdlyEvent[];
  getEventsForDate: (date: string) => DawdlyEvent[];
  onDayClick: (date: string) => void;
  onDeleteEvent: (id: string) => void;
  onEventClick: (event: DawdlyEvent) => void;
  onToggleDone: (id: string) => void;
  breakpoint: Breakpoint;
}

export default function WeekView({
  anchor,
  events,
  onDayClick,
  onDeleteEvent,
  onEventClick,
  breakpoint,
}: WeekViewProps) {
  const isMobile = breakpoint === "mobile";
  const days = isMobile
    ? [anchor, addDays(anchor, 1), addDays(anchor, 2)]
    : getWeekDays(anchor);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [detailEvent, setDetailEvent] = useState<{ event: DawdlyEvent; x: number; y: number } | null>(null);

  const [overrides, setOverrides] = useState<Record<string, StickerOverride>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("dawdly_sticker_overrides") ?? "{}"); }
    catch { return {}; }
  });

  function updateOverride(id: string, defaultRotation: number, patch: Partial<StickerOverride>) {
    setOverrides((prev) => {
      const cur = prev[id] ?? { size: STICKER_W, dx: 0, dy: 0, rotation: defaultRotation };
      const next = { ...prev, [id]: { ...cur, ...patch } };
      try { localStorage.setItem("dawdly_sticker_overrides", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  useEffect(() => {
    if (!scrollRef.current) return;
    const now = new Date();
    const y = (now.getHours() + now.getMinutes() / 60) * PX_PER_HOUR;
    scrollRef.current.scrollTop = Math.max(0, y - scrollRef.current.clientHeight / 2 + 40);
  }, []);

  const lastDay = days[days.length - 1];
  const horizonEvents = events
    .filter((e) => e.date > lastDay && e.kind !== "work")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 12);

  const now = new Date();
  const nowY = (now.getHours() + now.getMinutes() / 60) * PX_PER_HOUR;
  const todayStr = now.toISOString().slice(0, 10);

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--paper)" }}>

      {/* Month heading */}
      <div className="flex-shrink-0 text-center pt-4 pb-1">
        <span style={{ fontFamily: "var(--font-hand)", fontSize: 26, color: "var(--accent)", letterSpacing: "0.01em" }}>
          {formatMonthYear(days[0])}
        </span>
      </div>

      {/* Sticky day headers */}
      <div className="flex flex-shrink-0" style={{ borderBottom: "1px solid rgba(180,140,90,0.2)" }}>
        <div style={{ width: TIME_COL_W, flexShrink: 0 }} />
        {days.map((day, i) => {
          const { weekday, day: dayNum } = formatDayHeader(day);
          const todayDay = isToday(day);
          return (
            <div key={day} className="flex flex-1 min-w-0">
              {i > 0 && <div style={{ width: 1, background: "rgba(180,140,90,0.18)", flexShrink: 0 }} />}
              <button
                onClick={() => onDayClick(day)}
                className="flex-1 flex flex-col items-center py-2 hover:opacity-70 transition-opacity"
              >
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  color: todayDay ? "var(--accent)" : "var(--ink-faint)",
                }}>
                  {weekday}
                </span>
                <span style={{
                  fontFamily: "var(--font-serif)", fontSize: 22,
                  fontWeight: todayDay ? 700 : 500, lineHeight: 1.1,
                  color: todayDay ? "var(--accent)" : "var(--ink)",
                }}>
                  {dayNum}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex" style={{ height: TOTAL_H, overflow: "hidden" }}>

          {/* Time-label gutter */}
          <div style={{ width: TIME_COL_W, flexShrink: 0, position: "relative" }}>
            {Array.from({ length: 24 }, (_, h) => (
              <div
                key={h}
                style={{
                  position: "absolute",
                  top: h * PX_PER_HOUR - 7,
                  right: 6,
                  fontSize: 10,
                  fontFamily: "var(--font-hand)",
                  color: "var(--ink-faint)",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                {formatHour(h)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, i) => {
            const todayDay = isToday(day);
            const workPlaced = placeWorkEvents(events, day);
            const stickerPlaced = placePersonalStickers(events, day);

            return (
              <div key={day} className="flex flex-1 min-w-0">
                {i > 0 && <div style={{ width: 1, background: "rgba(180,140,90,0.18)", flexShrink: 0 }} />}

                <div
                  className="flex-1 relative cursor-pointer"
                  style={{ background: todayDay ? "rgba(221,130,38,0.04)" : "transparent", clipPath: i === days.length - 1 ? "inset(-9999px 0 -9999px -9999px)" : undefined }}
                  onClick={() => onDayClick(day)}
                >
                  {/* Hour lines */}
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} style={{
                      position: "absolute", top: h * PX_PER_HOUR, left: 0, right: 0,
                      height: 1, background: h === 0 ? "transparent" : "rgba(180,140,90,0.14)",
                    }} />
                  ))}

                  {/* Half-hour ticks */}
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} style={{
                      position: "absolute", top: h * PX_PER_HOUR + PX_PER_HOUR / 2,
                      left: 0, right: 0, height: 1, background: "rgba(180,140,90,0.06)",
                    }} />
                  ))}

                  {/* Current-time indicator */}
                  {todayDay && days.includes(todayStr) && (
                    <div style={{ position: "absolute", top: nowY, left: 0, right: 0, zIndex: 10, pointerEvents: "none" }}>
                      <div style={{ position: "absolute", top: -3, left: -2, width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
                      <div style={{ height: 2, background: "var(--accent)", opacity: 0.75 }} />
                    </div>
                  )}

                  {/* Work event blocks — lane-assigned, duration-based */}
                  {workPlaced.map((p) => (
                    <WorkEventBlock
                      key={p.event.id + (p.isContinuation ? "-c" : "")}
                      placed={p}
                      onEventClick={onEventClick}
                      onDeleteEvent={onDeleteEvent}
                    />
                  ))}

                  {/* Personal charm stickers */}
                  {stickerPlaced.map((p) => {
                    const ov = overrides[p.event.id];
                    return (
                      <PersonalCharmSticker
                        key={p.event.id}
                        placed={p}
                        size={ov?.size ?? STICKER_W}
                        dx={ov?.dx ?? 0}
                        dy={ov?.dy ?? 0}
                        rotation={ov?.rotation ?? p.rotation}
                        onUpdate={(patch) => updateOverride(p.event.id, p.rotation, patch)}
                        onShowDetail={(ev, x, y) => setDetailEvent({ event: ev, x, y })}
                        onDeleteEvent={(id) => { setDetailEvent(null); onDeleteEvent(id); }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* On the horizon — pinned to bottom */}
      <div className="flex-shrink-0" style={{ borderTop: "1.5px dashed rgba(180,140,90,0.3)" }}>
        {horizonEvents.length > 0 ? (
          <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: isMobile ? 8 : 12, paddingBottom: isMobile ? 8 : 16 }}>
            {!isMobile && (
              <p style={{ fontFamily: "var(--font-hand)", fontSize: 17, color: "var(--ink-muted)", marginBottom: 8, fontStyle: "italic" }}>
                on the horizon
              </p>
            )}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {horizonEvents.map((event) => {
                const col = cardColor(event.id);
                if (isMobile) {
                  return (
                    <div key={event.id} className="flex flex-col items-center gap-0.5 flex-shrink-0">
                      <div className="rounded-xl p-1" style={{ background: col.bg }}>
                        <CharmIcon charmId={event.charmId} size={32} />
                      </div>
                      <span style={{ fontFamily: "var(--font-hand)", fontSize: 10, color: "var(--ink-faint)", whiteSpace: "nowrap" }}>
                        {relativeDate(event.date)}
                      </span>
                    </div>
                  );
                }
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 flex-shrink-0"
                    style={{ background: col.bg, boxShadow: "var(--shadow-warm)" }}
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
          <p className="px-5 py-3" style={{ fontFamily: "var(--font-hand)", fontSize: isMobile ? 13 : 15, color: "var(--ink-faint)", fontStyle: "italic" }}>
            {isMobile ? "nothing ahead ♡" : "nothing on the horizon yet — add something to look forward to ♡"}
          </p>
        )}
      </div>

      {detailEvent && (
        <EventDetailCard
          event={detailEvent.event}
          x={detailEvent.x}
          y={detailEvent.y}
          onEdit={(ev) => { setDetailEvent(null); onEventClick(ev); }}
          onDelete={(id) => { setDetailEvent(null); onDeleteEvent(id); }}
          onClose={() => setDetailEvent(null)}
        />
      )}
    </div>
  );
}
