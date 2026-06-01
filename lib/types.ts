export type { CharmId } from "./charms";

export interface DawdlyEvent {
  id: string;
  title: string;
  kind?: "personal" | "work"; // undefined treated as "personal"
  charmId: string; // stored as raw string; resolved via resolveCharmId() at render time
  date: string;     // ISO YYYY-MM-DD — start date, used for calendar placement
  endDate: string;  // ISO YYYY-MM-DD
  startTime: string; // HH:MM 24h
  endTime: string;
  note?: string;
  done?: boolean;
  googleEventId?: string;
}

export type CalendarView = "week" | "month" | "day";
