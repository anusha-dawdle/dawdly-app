"use client";

import { useState } from "react";
import type { CalendarView } from "@/lib/types";
import { useEvents } from "@/lib/store";
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

  const { events, addEvent, deleteEvent, getEventsForDate } = useEvents();

  function openAddModal(date: string) {
    setModalDate(date);
    setShowModal(true);
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
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "#FFFDF9", fontFamily: "system-ui, sans-serif" }}
    >
      {/* Header */}
      <header
        className="grid grid-cols-3 items-center px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid #F0EBE0" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-bold"
            style={{ color: "#D97706", fontFamily: "Georgia, serif" }}
          >
            dawdly
          </span>
          <span className="text-lg">✦</span>
        </div>

        {/* View switcher */}
        <div className="flex justify-center">
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ background: "#F5EFE6", padding: 2 }}
        >
          {(["day", "week", "month"] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors"
              style={{
                background: view === v ? "#FFFDF9" : "transparent",
                color: view === v ? "#D97706" : "#B0A090",
                boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {v}
            </button>
          ))}
        </div>
        </div>

        {/* Nav + add */}
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl text-sm font-medium"
            style={{ background: "#F5EFE6", color: "#8B7355" }}
          >
            Today
          </button>
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "#F5EFE6", color: "#8B7355" }}
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "#F5EFE6", color: "#8B7355" }}
          >
            ›
          </button>
          <button
            onClick={() => openAddModal(anchor)}
            className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: "#F59E0B", color: "#3B1A08" }}
          >
            + Add
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
          />
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <AddEventModal
          defaultDate={modalDate}
          onSave={addEvent}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
