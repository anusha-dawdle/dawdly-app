"use client";

import { useState, useEffect, useCallback } from "react";
import type { DawdlyEvent } from "./types";

const STORAGE_KEY = "dawdly_events";

function loadEvents(): DawdlyEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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
    (date: string) => events.filter((e) => e.date === date),
    [events]
  );

  return { events, addEvent, deleteEvent, updateEvent, getEventsForDate };
}
