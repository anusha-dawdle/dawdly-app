"use client";

import { useState, useEffect, useCallback } from "react";
import type { DawdlyEvent } from "./types";
import { resolveCharmId } from "./charms";

const STORAGE_KEY = "dawdly_events";

function loadEvents(): DawdlyEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: DawdlyEvent[] = JSON.parse(raw);
    // Migrate legacy charmIds to new PNG-based ids
    return parsed.map((e) => ({ ...e, charmId: resolveCharmId(e.charmId) }));
  } catch {
    return [];
  }
}

function saveEvents(events: DawdlyEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function useEvents() {
  const [events, setEvents] = useState<DawdlyEvent[]>([]);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  const addEvent = useCallback((event: DawdlyEvent) => {
    setEvents((prev) => {
      const next = [...prev, event];
      saveEvents(next);
      return next;
    });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveEvents(next);
      return next;
    });
  }, []);

  const updateEvent = useCallback((updated: DawdlyEvent) => {
    setEvents((prev) => {
      const next = prev.map((e) => (e.id === updated.id ? updated : e));
      saveEvents(next);
      return next;
    });
  }, []);

  const getEventsForDate = useCallback(
    (date: string) =>
      events
        .filter((e) => e.date === date)
        .sort((a, b) => {
          if (!a.startTime && !b.startTime) return 0;
          if (!a.startTime) return 1;
          if (!b.startTime) return -1;
          return a.startTime.localeCompare(b.startTime);
        }),
    [events]
  );

  return { events, addEvent, deleteEvent, updateEvent, getEventsForDate };
}
