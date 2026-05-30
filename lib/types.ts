export type CharmId =
  | "coffee"
  | "dinner"
  | "party"
  | "movie"
  | "travel"
  | "picnic"
  | "concert"
  | "date"
  | "friends"
  | "spa"
  | "book"
  | "art"
  | "sports"
  | "birthday"
  | "sunset"
  | "garden";

export interface Charm {
  id: CharmId;
  label: string;
  svg: string; // inline SVG string
}

export interface DawdlyEvent {
  id: string;
  title: string;
  charmId: CharmId;
  date: string; // ISO date string YYYY-MM-DD
  startTime?: string; // HH:MM 24h, optional
  endTime?: string;
  note?: string;
}

export type CalendarView = "week" | "month" | "day";
