"use client";

import { useState, useEffect } from "react";
import type { DawdlyEvent } from "@/lib/types";
import { useBreakpoint } from "@/lib/breakpoint";
import {
  GCAL_CLIENT_ID,
  getToken,
  revokeToken,
  requestToken,
  fetchUpcomingEvents,
  gcalDate,
  gcalTime,
  type GCalEvent,
} from "@/lib/google-calendar";

const GCAL_AUTO_MARKERS = [
  "g.co/calendar",
  "extsrc=cal",
  "automatically created events",
  "created from an email",
];

function cleanDescription(raw?: string): string | undefined {
  if (!raw) return undefined;
  const text = raw.replace(/<[^>]*>/g, "").trim();
  if (!text) return undefined;
  if (GCAL_AUTO_MARKERS.some((m) => text.includes(m))) return undefined;
  return text.slice(0, 300) || undefined;
}

interface ImportItem {
  gcalEvent: GCalEvent;
  selected: boolean;
}

function formatImportDate(start: { dateTime?: string; date?: string }): string {
  const iso = (start.dateTime ?? start.date ?? "").slice(0, 10);
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];
  if (start.dateTime) {
    const dt = new Date(start.dateTime);
    const h = dt.getHours();
    const min = String(dt.getMinutes()).padStart(2, "0");
    const period = h >= 12 ? "pm" : "am";
    return `${weekday}, ${month} ${d} · ${h % 12 || 12}:${min} ${period}`;
  }
  return `${weekday}, ${month} ${d}`;
}

interface Props {
  events: DawdlyEvent[];
  addEvent: (event: DawdlyEvent) => void;
}

export default function GoogleCalendarImport({ events, addEvent }: Props) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  const [connected, setConnected] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "selecting">("idle");
  const [items, setItems] = useState<ImportItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConnected(!!getToken());
  }, []);

  const importedIds = new Set(
    events.map((e) => e.googleEventId).filter((id): id is string => !!id)
  );

  function buildItems(gcalEvents: GCalEvent[]): ImportItem[] {
    return gcalEvents.map((e) => ({
      gcalEvent: e,
      selected: !importedIds.has(e.id),
    }));
  }

  function loadEvents(token: string) {
    setPhase("loading");
    setError(null);
    fetchUpcomingEvents(token)
      .then((gcalEvents) => {
        setConnected(true);
        setItems(buildItems(gcalEvents));
        setPhase("selecting");
      })
      .catch((e: Error) => {
        if (e.message === "auth") {
          setError("Session expired — please reconnect.");
          setConnected(false);
        } else {
          setError("Couldn't fetch calendar events.");
        }
        setPhase("idle");
      });
  }

  function handleConnect() {
    if (!GCAL_CLIENT_ID) {
      setError("Google Client ID not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local");
      return;
    }
    const existing = getToken();
    if (existing) { loadEvents(existing); return; }
    setPhase("loading");
    requestToken(
      (token) => loadEvents(token),
      (msg) => { setError(msg); setPhase("idle"); }
    );
  }

  function handleDisconnect() {
    revokeToken();
    setConnected(false);
    setPhase("idle");
    setItems([]);
  }

  function handleClose() {
    setPhase("idle");
    setItems([]);
    setError(null);
  }

  function toggleSelect(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.gcalEvent.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  }

  function selectAll() {
    setItems((prev) =>
      prev.map((item) => ({ ...item, selected: !importedIds.has(item.gcalEvent.id) }))
    );
  }

  function deselectAll() {
    setItems((prev) => prev.map((item) => ({ ...item, selected: false })));
  }

  function handleImport() {
    const toImport = items.filter(
      (item) => item.selected && !importedIds.has(item.gcalEvent.id) && !!item.gcalEvent.start.dateTime
    );
    for (const item of toImport) {
      const event: DawdlyEvent = {
        id: crypto.randomUUID(),
        title: item.gcalEvent.summary?.trim() || "Untitled event",
        kind: "work",
        charmId: "extra-star",
        date: gcalDate(item.gcalEvent.start),
        endDate: gcalDate(item.gcalEvent.end),
        startTime: gcalTime(item.gcalEvent.start) as string,
        endTime: gcalTime(item.gcalEvent.end) as string,
        note: cleanDescription(item.gcalEvent.description),
        googleEventId: item.gcalEvent.id,
      };
      addEvent(event);
    }
    handleClose();
  }

  const newItems = items.filter((item) => !importedIds.has(item.gcalEvent.id));
  const selectedCount = newItems.filter((item) => item.selected).length;

  return (
    <>
      {/* Header trigger button */}
      <button
        onClick={phase === "idle" ? handleConnect : undefined}
        disabled={phase === "loading"}
        className="px-3 py-1.5 rounded-xl transition-all flex-shrink-0"
        style={{
          fontFamily: "var(--font-hand)",
          fontSize: isMobile ? 13 : 15,
          background: connected ? "rgba(221,130,38,0.12)" : "rgba(180,140,90,0.12)",
          color: connected ? "var(--accent)" : "var(--ink-muted)",
          border: connected ? "1px solid rgba(221,130,38,0.25)" : "1px solid transparent",
          opacity: phase === "loading" ? 0.6 : 1,
        }}
        title={connected ? "Sync Google Calendar" : "Connect Google Calendar"}
      >
        {phase === "loading" ? "syncing…" : connected ? "gcal ✓" : "gcal"}
      </button>

      {/* Error toast */}
      {error && phase === "idle" && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2.5 cursor-pointer"
          style={{
            background: "var(--ink)",
            color: "var(--paper)",
            fontFamily: "var(--font-hand)",
            fontSize: 14,
            boxShadow: "0 4px 20px rgba(74,61,49,0.3)",
            whiteSpace: "nowrap",
            maxWidth: "90vw",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          onClick={() => setError(null)}
        >
          {error}
        </div>
      )}

      {/* Import modal */}
      {phase === "selecting" && (
        <div
          className="fixed inset-0 z-50 flex"
          style={{
            background: "rgba(74,61,49,0.35)",
            backdropFilter: "blur(5px)",
            alignItems: isMobile ? "flex-end" : "center",
            justifyContent: "center",
            padding: isMobile ? 0 : 16,
          }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : 500,
              background: "var(--paper)",
              border: isMobile ? "none" : "1px solid rgba(180,140,90,0.25)",
              boxShadow: "0 8px 40px rgba(74,61,49,0.2)",
              maxHeight: isMobile ? "90vh" : "80vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: isMobile ? "24px 24px 0 0" : 24,
            }}
          >
            {/* Modal header */}
            <div className="px-6 pt-5 pb-3 flex-shrink-0 flex items-start justify-between gap-3">
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  import from google calendar
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 13,
                    color: "var(--ink-muted)",
                    marginTop: 3,
                  }}
                >
                  next 90 days · {items.length} event{items.length !== 1 ? "s" : ""} found
                  {importedIds.size > 0 && ` · ${importedIds.size} already imported`}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 mt-1">
                <button
                  onClick={handleDisconnect}
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 12,
                    color: "var(--ink-faint)",
                    textDecoration: "underline",
                  }}
                >
                  disconnect
                </button>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(74,61,49,0.08)",
                    color: "var(--ink-muted)",
                    fontSize: 16,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Select all / none */}
            {newItems.length > 0 && (
              <div className="px-6 pb-2 flex-shrink-0 flex gap-3">
                <button
                  onClick={selectAll}
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 13,
                    color: "var(--accent)",
                    textDecoration: "underline",
                  }}
                >
                  select all
                </button>
                <button
                  onClick={deselectAll}
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 13,
                    color: "var(--ink-muted)",
                    textDecoration: "underline",
                  }}
                >
                  none
                </button>
              </div>
            )}

            {/* Event list */}
            <div className="overflow-y-auto flex-1 px-4 pb-2">
              {items.length === 0 ? (
                <p
                  className="text-center py-8"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 15,
                    color: "var(--ink-faint)",
                  }}
                >
                  no upcoming events found
                </p>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {items.map((item) => {
                    const alreadyImported = importedIds.has(item.gcalEvent.id);
                    return (
                      <div
                        key={item.gcalEvent.id}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                        style={{
                          background:
                            item.selected && !alreadyImported
                              ? "rgba(221,130,38,0.06)"
                              : "transparent",
                          opacity: alreadyImported ? 0.45 : 1,
                        }}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => !alreadyImported && toggleSelect(item.gcalEvent.id)}
                          disabled={alreadyImported}
                          className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all"
                          style={{
                            background:
                              item.selected && !alreadyImported
                                ? "var(--accent)"
                                : "transparent",
                            border: `1.5px solid ${
                              item.selected && !alreadyImported
                                ? "var(--accent)"
                                : "rgba(180,140,90,0.4)"
                            }`,
                            color: "#fff",
                            fontSize: 11,
                            cursor: alreadyImported ? "default" : "pointer",
                          }}
                        >
                          {item.selected && !alreadyImported ? "✓" : ""}
                        </button>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 15,
                              color: "var(--ink)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.gcalEvent.summary || "Untitled event"}
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 12,
                              color: "var(--ink-muted)",
                              marginTop: 1,
                            }}
                          >
                            {formatImportDate(item.gcalEvent.start)}
                          </p>
                        </div>

                        {alreadyImported && (
                          <span
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 11,
                              color: "var(--ink-faint)",
                              flexShrink: 0,
                            }}
                          >
                            imported
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex gap-2 px-6 pb-5 pt-3 flex-shrink-0"
              style={{ borderTop: "1.5px dashed rgba(180,140,90,0.2)" }}
            >
              <button
                onClick={handleClose}
                className="flex-1 rounded-xl py-2.5"
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 16,
                  background: "rgba(180,140,90,0.12)",
                  color: "var(--ink-muted)",
                }}
              >
                cancel
              </button>
              <button
                onClick={handleImport}
                disabled={selectedCount === 0}
                className="flex-1 rounded-xl py-2.5 transition-all"
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 16,
                  fontWeight: 600,
                  background:
                    selectedCount > 0 ? "var(--accent)" : "rgba(180,140,90,0.15)",
                  color: selectedCount > 0 ? "#fff" : "var(--ink-faint)",
                }}
              >
                {selectedCount > 0
                  ? `import ${selectedCount} event${selectedCount !== 1 ? "s" : ""}`
                  : newItems.length === 0
                  ? "all caught up ✦"
                  : "select events to import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
