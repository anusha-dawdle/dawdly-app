import type { DawdlyEvent } from "./types";

export const PX_PER_MIN = 1; // 60px per hour

export function timeToMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function minToLabel(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const h12 = h % 12 || 12;
  const period = h >= 12 ? "pm" : "am";
  return `${h12}${period}`;
}

export function formatTimeRange(start: string, end?: string): string {
  function fmt(t: string) {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "pm" : "am";
    const h12 = h % 12 || 12;
    return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, "0")}${period}`;
  }
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

export function effectiveEnd(event: DawdlyEvent): number {
  if (event.endTime) return timeToMin(event.endTime);
  return timeToMin(event.startTime!) + 60;
}

export function adaptiveRange(events: DawdlyEvent[]): { startMin: number; endMin: number } {
  const timed = events.filter((e) => e.startTime);
  if (timed.length === 0) return { startMin: 9 * 60, endMin: 18 * 60 };

  let lo = Math.min(...timed.map((e) => timeToMin(e.startTime!)));
  let hi = Math.max(...timed.map((e) => effectiveEnd(e)));

  lo = Math.max(0, lo - 30);
  hi = Math.min(24 * 60, hi + 30);

  const startMin = Math.floor(lo / 60) * 60;
  let endMin = Math.ceil(hi / 60) * 60;

  if (endMin - startMin < 6 * 60) endMin = startMin + 6 * 60;

  return { startMin, endMin };
}

export function eventTop(startHHMM: string, rangeStart: number): number {
  return (timeToMin(startHHMM) - rangeStart) * PX_PER_MIN;
}

export function eventHeight(startHHMM: string, endHHMM: string): number {
  return Math.max(24, (timeToMin(endHHMM) - timeToMin(startHHMM)) * PX_PER_MIN);
}

export interface LanedEvent {
  event: DawdlyEvent;
  lane: number;
  totalLanes: number;
}

export function assignLanes(events: DawdlyEvent[]): LanedEvent[] {
  const timed = [...events]
    .filter((e) => e.startTime)
    .sort((a, b) => timeToMin(a.startTime!) - timeToMin(b.startTime!));


  const result: LanedEvent[] = [];
  const laneEnds: number[] = [];

  for (const event of timed) {
    const start = timeToMin(event.startTime!);
    const end = event.endTime ? timeToMin(event.endTime) : start + 60;

    let assigned = -1;
    for (let i = 0; i < laneEnds.length; i++) {
      if (laneEnds[i] <= start) {
        laneEnds[i] = end;
        assigned = i;
        break;
      }
    }
    if (assigned === -1) {
      laneEnds.push(end);
      assigned = laneEnds.length - 1;
    }
    result.push({ event, lane: assigned, totalLanes: 0 });
  }

  for (const item of result) {
    const start = timeToMin(item.event.startTime!);
    const end = item.event.endTime ? timeToMin(item.event.endTime) : start + 60;
    let maxLane = 0;
    for (const other of result) {
      const os = timeToMin(other.event.startTime!);
      const oe = other.event.endTime ? timeToMin(other.event.endTime) : os + 60;
      if (os < end && oe > start) maxLane = Math.max(maxLane, other.lane);
    }
    item.totalLanes = maxLane + 1;
  }

  return result;
}
