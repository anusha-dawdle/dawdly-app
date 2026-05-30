"use client";

import { useState } from "react";
import type { DawdlyEvent, CharmId } from "@/lib/types";
import { CHARM_LIST } from "@/lib/charms";
import CharmIcon from "./CharmIcon";

interface AddEventModalProps {
  defaultDate: string;
  onSave: (event: DawdlyEvent) => void;
  onClose: () => void;
}

export default function AddEventModal({
  defaultDate,
  onSave,
  onClose,
}: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState("");
  const [selectedCharm, setSelectedCharm] = useState<CharmId>("coffee");
  const [note, setNote] = useState("");

  function handleSave() {
    if (!title.trim()) return;
    const event: DawdlyEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      charmId: selectedCharm,
      date,
      startTime: startTime || undefined,
      note: note.trim() || undefined,
    };
    onSave(event);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 shadow-2xl"
        style={{ background: "#FFFDF9", border: "1.5px solid #F0EBE0" }}
      >
        <h2
          className="text-xl font-semibold mb-5"
          style={{ color: "#7C3D1A", fontFamily: "Georgia, serif" }}
        >
          Something to look forward to
        </h2>

        {/* Charm picker */}
        <div className="mb-4">
          <label
            className="block text-sm mb-2"
            style={{ color: "#8B7355" }}
          >
            Pick a charm
          </label>
          <div className="grid grid-cols-8 gap-1.5">
            {CHARM_LIST.map((charm) => (
              <button
                key={charm.id}
                onClick={() => setSelectedCharm(charm.id)}
                title={charm.label}
                className="rounded-xl p-0.5 transition-all"
                style={{
                  background:
                    selectedCharm === charm.id ? "#FDE68A" : "transparent",
                  outline:
                    selectedCharm === charm.id
                      ? "2px solid #D97706"
                      : "2px solid transparent",
                }}
              >
                <CharmIcon charmId={charm.id} size={36} />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="What are you looking forward to?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-full rounded-xl px-4 py-3 text-base outline-none"
            style={{
              background: "#FFF8F0",
              border: "1.5px solid #E8DDD0",
              color: "#7C3D1A",
            }}
            autoFocus
          />
        </div>

        {/* Date + Time row */}
        <div className="flex gap-2 mb-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              background: "#FFF8F0",
              border: "1.5px solid #E8DDD0",
              color: "#7C3D1A",
            }}
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-32 rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              background: "#FFF8F0",
              border: "1.5px solid #E8DDD0",
              color: "#7C3D1A",
            }}
          />
        </div>

        {/* Note */}
        <div className="mb-5">
          <textarea
            placeholder="Any notes? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
            style={{
              background: "#FFF8F0",
              border: "1.5px solid #E8DDD0",
              color: "#7C3D1A",
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors"
            style={{
              background: "#F5EFE6",
              color: "#8B7355",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all"
            style={{
              background: title.trim() ? "#F59E0B" : "#E8DDD0",
              color: title.trim() ? "#3B1A08" : "#B0A090",
            }}
          >
            Add to my week ✨
          </button>
        </div>
      </div>
    </div>
  );
}
