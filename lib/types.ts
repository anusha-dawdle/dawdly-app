export type { CharmId } from "./charms";

export interface DawdlyEvent {
  id: string;
  title: string;
  charmId: string; // stored as raw string; resolved via resolveCharmId() at render time
  date: string;    // ISO YYYY-MM-DD
  startTime?: string; // HH:MM 24h
  endTime?: string;
  note?: string;
}

export type CalendarView = "week" | "month" | "day";
