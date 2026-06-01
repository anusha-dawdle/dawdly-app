"use client";

import { useState } from "react";
import type { CalendarView } from "@/lib/types";
import { useEvents } from "@/lib/store";
import { useBreakpoint } from "@/lib/breakpoint";
import { today, addDays } from "@/lib/dates";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import DayView from "./DayView";
import AddEventModal from "./AddEventModal";
import GoogleCalendarImport from "./GoogleCalendarImport";

export default function DawdlyApp() {
  const [view, setView] = useState<CalendarView>("week");
  const [anchor, setAnchor] = useState(today());
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(today());
  const [editingEvent, setEditingEvent] = useState<import("@/lib/types").DawdlyEvent | null>(null);

  const { events, addEvent, deleteEvent, updateEvent, getEventsForDate } = useEvents();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  function openAddModal(date: string) {
    setEditingEvent(null);
    setModalDate(date);
    setShowModal(true);
  }

  function openEditModal(event: import("@/lib/types").DawdlyEvent) {
    setEditingEvent(event);
    setModalDate(event.date);
    setShowModal(true);
  }

  function handleSaveEvent(event: import("@/lib/types").DawdlyEvent) {
    if (editingEvent) updateEvent(event);
    else addEvent(event);
  }

  function handleToggleDone(id: string) {
    const event = events.find((e) => e.id === id);
    if (event) updateEvent({ ...event, done: !event.done });
  }

  const weekStep = isMobile ? 3 : 7;

  function handlePrev() {
    if (view === "week") setAnchor((a) => addDays(a, -weekStep));
    else if (view === "month")
      setAnchor((a) => {
        const [y, m] = a.split("-").map(Number);
        const prev = new Date(y, m - 2, 1);
        return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-01`;
      });
    else setAnchor((a) => addDays(a, -1));
  }

  function handleNext() {
    if (view === "week") setAnchor((a) => addDays(a, weekStep));
    else if (view === "month")
      setAnchor((a) => {
        const [y, m] = a.split("-").map(Number);
        const next = new Date(y, m, 1);
        return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-01`;
      });
    else setAnchor((a) => addDays(a, 1));
  }

  function handleToday() { setAnchor(today()); }

  function handleDayClick(date: string) {
    if (view === "month") {
      setAnchor(date);
      setView("day");
    } else {
      openAddModal(date);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--paper)", minWidth: isMobile ? 320 : breakpoint === "tablet" ? 600 : 900 }}>

      {/* Header */}
      <header
        className="flex-shrink-0 px-4 py-3 flex items-center justify-between gap-2"
        style={{ borderBottom: "1.5px dashed rgba(180,140,90,0.3)" }}
      >
        {/* Wordmark + View switcher */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span style={{ fontFamily: "var(--font-serif)", fontSize: isMobile ? 22 : 26, fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.01em" }}>
              dawdly
            </span>
            <span style={{ color: "var(--marker)", fontSize: isMobile ? 18 : 24 }}>✦</span>
          </div>

          {/* View switcher — hidden on mobile (bottom nav instead) */}
          {!isMobile && (
            <div className="flex rounded-xl overflow-hidden" style={{ background: "rgba(180,140,90,0.12)", padding: 2 }}>
              {(["day", "week", "month"] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="px-4 py-1.5 rounded-lg transition-colors"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 15,
                    background: view === v ? "var(--paper)" : "transparent",
                    color: view === v ? "var(--accent)" : "var(--ink-muted)",
                    boxShadow: view === v ? "0 1px 4px rgba(74,61,49,0.1)" : "none",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <GoogleCalendarImport events={events} addEvent={addEvent} />
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl"
            style={{ fontFamily: "var(--font-hand)", fontSize: isMobile ? 13 : 15, background: "rgba(180,140,90,0.12)", color: "var(--ink-muted)" }}
          >
            today
          </button>
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(180,140,90,0.12)", color: "var(--ink-muted)", fontSize: 18 }}
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(180,140,90,0.12)", color: "var(--ink-muted)", fontSize: 18 }}
          >
            ›
          </button>
          <button
            onClick={() => openAddModal(anchor)}
            className="px-3 py-1.5 rounded-xl transition-all"
            style={{ fontFamily: "var(--font-hand)", fontSize: isMobile ? 13 : 15, fontWeight: 600, background: "var(--accent)", color: "#fff" }}
          >
            + add
          </button>
        </div>
      </header>

      {/* Calendar body — bottom padding on mobile for nav bar */}
      <main className="flex-1 overflow-hidden" style={{ paddingBottom: isMobile ? 56 : 0 }}>
        {view === "week" && (
          <WeekView
            anchor={anchor}
            events={events}
            getEventsForDate={getEventsForDate}
            onDayClick={handleDayClick}
            onDeleteEvent={deleteEvent}
            onEventClick={openEditModal}
            onToggleDone={handleToggleDone}
            breakpoint={breakpoint}
          />
        )}
        {view === "month" && (
          <MonthView
            anchor={anchor}
            getEventsForDate={getEventsForDate}
            onDayClick={handleDayClick}
            breakpoint={breakpoint}
          />
        )}
        {view === "day" && (
          <DayView
            date={anchor}
            getEventsForDate={getEventsForDate}
            onAddClick={() => openAddModal(anchor)}
            onDeleteEvent={deleteEvent}
            onEventClick={openEditModal}
            onToggleDone={handleToggleDone}
            breakpoint={breakpoint}
          />
        )}
      </main>

      {/* Bottom nav — mobile only */}
      {isMobile && (
        <nav
          className="fixed bottom-0 left-0 right-0 flex justify-around items-center"
          style={{
            height: 56,
            background: "var(--paper)",
            borderTop: "1.5px dashed rgba(180,140,90,0.3)",
            zIndex: 40,
          }}
        >
          {(["day", "week", "month"] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="flex-1 flex flex-col items-center justify-center py-1 gap-0.5"
              style={{
                fontFamily: "var(--font-hand)",
                fontSize: 13,
                color: view === v ? "var(--accent)" : "var(--ink-faint)",
              }}
            >
              <span style={{ fontSize: 18 }}>
                {v === "day" ? "◦" : v === "week" ? "⊞" : "⊟"}
              </span>
              {v}
            </button>
          ))}
        </nav>
      )}

      {/* Modal */}
      {showModal && (
        <AddEventModal
          defaultDate={modalDate}
          editEvent={editingEvent ?? undefined}
          onSave={handleSaveEvent}
          onClose={() => { setShowModal(false); setEditingEvent(null); }}
        />
      )}
    </div>
  );
}
