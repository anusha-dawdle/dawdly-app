export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function today(): string {
  return toISO(new Date());
}

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function startOfWeek(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - day);
  return toISO(d);
}

export function getWeekDays(anchorIso: string): string[] {
  const start = startOfWeek(anchorIso);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function startOfMonth(iso: string): string {
  return iso.slice(0, 7) + "-01";
}

export function getDaysInMonth(iso: string): string[] {
  const [year, month] = iso.split("-").map(Number);
  const count = new Date(year, month, 0).getDate();
  return Array.from({ length: count }, (_, i) => {
    const d = i + 1;
    return `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  });
}

export function formatMonthYear(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDayHeader(iso: string): { weekday: string; day: string } {
  const d = new Date(iso + "T12:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    day: String(d.getDate()),
  };
}

export function isToday(iso: string): boolean {
  return iso === today();
}

export function isSameMonth(iso: string, anchor: string): boolean {
  return iso.slice(0, 7) === anchor.slice(0, 7);
}

export function relativeDate(iso: string): string {
  const todayIso = today();
  const t = new Date(todayIso + "T12:00:00");
  const d = new Date(iso + "T12:00:00");
  const diff = Math.round((d.getTime() - t.getTime()) / 86_400_000);

  if (diff === 1) return "tomorrow";
  if (diff < 7) return `in ${diff} days`;
  if (diff < 14) return "next week";
  if (diff < 28) return `in ${Math.floor(diff / 7)} weeks`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
