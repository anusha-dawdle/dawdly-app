"use client";

import { useState } from "react";
import type { CalendarView } from "@/lib/types";
import { useEvents, useCharmSize } from "@/lib/store";
import { today, addDays, getWeekDays, startOfMonth } from "@/lib/dates";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import DayView from "./DayView";
import AddEventModal from "./AddEventModal";

export default function DawdlyApp() {
  const [view, setView] = useState<CalendarView>("week");
  const [anchor, setAnchor] = useState(today());
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(today());

  const [editingEvent, setEditingEvent] = useState<import("@/lib/types").DawdlyEvent | null>(null);

  const { events, addEvent, deleteEvent, updateEvent, getEventsForDate } = useEvents();
  const { charmSize, increase, decrease, atMin, atMax } = useCharmSize();

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

  function handlePrev() {
    if (view === "week") setAnchor((a) => addDays(a, -7));
    else if (view === "month")
      setAnchor((a) => {
        const [y, m] = a.split("-").map(Number);
        const prev = new Date(y, m - 2, 1);
        return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-01`;
      });
    else setAnchor((a) => addDays(a, -1));
  }

  function handleNext() {
    if (view === "week") setAnchor((a) => addDays(a, 7));
    else if (view === "month")
      setAnchor((a) => {
        const [y, m] = a.split("-").map(Number);
        const next = new Date(y, m, 1);
        return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-01`;
      });
    else setAnchor((a) => addDays(a, 1));
  }

  function handleToday() {
    setAnchor(today());
  }

  function handleDayClick(date: string) {
    if (view === "month") {
      setAnchor(date);
      setView("day");
    } else {
      openAddModal(date);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <header
        className="grid grid-cols-3 items-center px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1.5px dashed rgba(180,140,90,0.3)" }}
      >
        {/* Wordmark */}
        <div className="flex items-center gap-1.5">
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.01em" }}>
            dawdly
          </span>
          <span style={{ color: "var(--marker)", fontSize: 16 }}>✦</span>
        </div>

        {/* View switcher */}
        <div className="flex justify-center">
          <div
            className="flex rounded-xl overflow-hidden"
            style={{ background: "rgba(180,140,90,0.12)", padding: 2 }}
          >
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
        </div>

        {/* Nav + add */}
        <div className="flex items-center gap-2 justify-end">
          {/* Charm size control — week and day only */}
          {(view === "week" || view === "day") && (
            <div className="flex items-center gap-0.5 rounded-xl overflow-hidden" style={{ background: "rgba(180,140,90,0.12)" }}>
              <button
                onClick={decrease}
                disabled={atMin}
                className="w-7 h-8 flex items-center justify-center transition-opacity"
                style={{ fontSize: 18, color: atMin ? "var(--ink-faint)" : "var(--ink-muted)", fontFamily: "var(--font-sans)" }}
                title="Smaller charms"
              >
                −
              </button>
              <span style={{ fontSize: 13, color: "var(--ink-faint)", userSelect: "none" }}>✦</span>
              <button
                onClick={increase}
                disabled={atMax}
                className="w-7 h-8 flex items-center justify-center transition-opacity"
                style={{ fontSize: 18, color: atMax ? "var(--ink-faint)" : "var(--ink-muted)", fontFamily: "var(--font-sans)" }}
                title="Larger charms"
              >
                +
              </button>
            </div>
          )}
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl"
            style={{ fontFamily: "var(--font-hand)", fontSize: 15, background: "rgba(180,140,90,0.12)", color: "var(--ink-muted)" }}
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
            className="px-4 py-1.5 rounded-xl transition-all"
            style={{ fontFamily: "var(--font-hand)", fontSize: 15, fontWeight: 600, background: "var(--accent)", color: "#fff" }}
          >
            + add
          </button>
        </div>
      </header>

      {/* Calendar body */}
      <main className="flex-1 overflow-hidden">
        {view === "week" && (
          <WeekView
            anchor={anchor}
            events={events}
            getEventsForDate={getEventsForDate}
            onDayClick={handleDayClick}
            onDeleteEvent={deleteEvent}
            onEventClick={openEditModal}
            charmSize={charmSize}
          />
        )}
        {view === "month" && (
          <MonthView
            anchor={anchor}
            getEventsForDate={getEventsForDate}
            onDayClick={handleDayClick}
          />
        )}
        {view === "day" && (
          <DayView
            date={anchor}
            getEventsForDate={getEventsForDate}
            onAddClick={() => openAddModal(anchor)}
            onDeleteEvent={deleteEvent}
            onEventClick={openEditModal}
            charmSize={charmSize}
          />
        )}
      </main>

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
