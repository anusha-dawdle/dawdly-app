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

const CHARM_SIZE_KEY = "dawdly_charm_size";
const CHARM_SIZE_MIN = 80;
const CHARM_SIZE_MAX = 260;
const CHARM_SIZE_DEFAULT = 160;
const CHARM_SIZE_STEP = 20;

export function useCharmSize() {
  const [charmSize, setCharmSize] = useState(CHARM_SIZE_DEFAULT);

  useEffect(() => {
    const saved = localStorage.getItem(CHARM_SIZE_KEY);
    if (saved) setCharmSize(Number(saved));
  }, []);

  const increase = useCallback(() => {
    setCharmSize((prev) => {
      const next = Math.min(CHARM_SIZE_MAX, prev + CHARM_SIZE_STEP);
      localStorage.setItem(CHARM_SIZE_KEY, String(next));
      return next;
    });
  }, []);

  const decrease = useCallback(() => {
    setCharmSize((prev) => {
      const next = Math.max(CHARM_SIZE_MIN, prev - CHARM_SIZE_STEP);
      localStorage.setItem(CHARM_SIZE_KEY, String(next));
      return next;
    });
  }, []);

  const atMin = charmSize <= CHARM_SIZE_MIN;
  const atMax = charmSize >= CHARM_SIZE_MAX;

  return { charmSize, increase, decrease, atMin, atMax };
}
