"use client";

import { useState, useMemo } from "react";
import type { DawdlyEvent } from "@/lib/types";
import { useBreakpoint } from "@/lib/breakpoint";
import { CHARM_LIST, CHARM_CATEGORIES, CHARMS, DEFAULT_CHARM_ID, pickExtraCharm, suggestCharm, type CharmId, type Charm } from "@/lib/charms";
import CharmIcon from "./CharmIcon";

import { resolveCharmId } from "@/lib/charms";

interface AddEventModalProps {
  defaultDate: string;
  editEvent?: DawdlyEvent;
  onSave: (event: DawdlyEvent) => void;
  onClose: () => void;
}

export default function AddEventModal({ defaultDate, editEvent, onSave, onClose }: AddEventModalProps) {
  const isMobile = useBreakpoint() === "mobile";
  const [kind, setKind]                 = useState<"personal" | "work">(editEvent?.kind ?? "personal");
  const [title, setTitle]               = useState(editEvent?.title ?? "");
  const [date, setDate]                 = useState(editEvent?.date ?? defaultDate);
  const [endDate, setEndDate]           = useState(() => {
    const startDate = editEvent?.date ?? defaultDate;
    const st = editEvent?.startTime ?? "";
    const et = editEvent?.endTime ?? "";
    // Only trust a stored endDate if it differs from startDate — otherwise it
    // may have been saved before smart defaulting existed and could be wrong.
    if (editEvent?.endDate && editEvent.endDate !== startDate) return editEvent.endDate;
    if (st && et && et < st) {
      const d = new Date(startDate + "T00:00:00");
      d.setDate(d.getDate() + 1);
      return d.toISOString().slice(0, 10);
    }
    return startDate;
  });
  const [endDateManual, setEndDateManual] = useState(
    !!editEvent?.endDate && editEvent.endDate !== editEvent.date
  );
  const [startTime, setStartTime]       = useState(editEvent?.startTime ?? "");
  const [endTime, setEndTime]           = useState(editEvent?.endTime ?? "");
  const [note, setNote]                 = useState(editEvent?.note ?? "");
  const [selectedCharm, setSelectedCharm] = useState<CharmId>(
    editEvent ? resolveCharmId(editEvent.charmId) : DEFAULT_CHARM_ID
  );
  const [userPickedCharm, setUserPickedCharm] = useState(!!editEvent);
  const [charmSearch, setCharmSearch]   = useState("");

  const isEditing = !!editEvent;

  // Auto-suggest based on title unless user has explicitly picked
  const suggested = useMemo(() => suggestCharm(title), [title]);
  const effectiveCharm: CharmId = userPickedCharm ? selectedCharm : (suggested ?? DEFAULT_CHARM_ID);

  const filteredCharms = useMemo(() => {
    const q = charmSearch.toLowerCase();
    if (!q) return CHARM_LIST;
    return CHARM_LIST.filter(
      (c) => c.label.toLowerCase().includes(q) || c.keywords.some((k) => k.includes(q))
    );
  }, [charmSearch]);

  function pickCharm(id: CharmId) {
    setSelectedCharm(id);
    setUserPickedCharm(true);
  }

  function smartEndDate(startDate: string, st: string, et: string): string {
    if (st && et && et < st) {
      const d = new Date(startDate + "T00:00:00");
      d.setDate(d.getDate() + 1);
      return d.toISOString().slice(0, 10);
    }
    return startDate;
  }

  function handleStartDateChange(val: string) {
    setDate(val);
    if (!endDateManual) setEndDate(smartEndDate(val, startTime, endTime));
  }

  function handleStartTimeChange(val: string) {
    setStartTime(val);
    if (!endDateManual) setEndDate(smartEndDate(date, val, endTime));
  }

  function handleEndTimeChange(val: string) {
    setEndTime(val);
    if (!endDateManual) setEndDate(smartEndDate(date, startTime, val));
  }

  function handleSave() {
    if (!title.trim() || !startTime || !endTime) return;
    const id = editEvent?.id ?? crypto.randomUUID();
    const charmId = kind === "work" ? "star" : (userPickedCharm ? selectedCharm : (suggested ?? pickExtraCharm(id)));
    onSave({ id, title: title.trim(), kind, charmId, date, endDate, startTime, endTime, note: note.trim() || undefined });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ background: "rgba(74,61,49,0.35)", backdropFilter: "blur(5px)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 16 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 448,
          background: "var(--paper)",
          border: isMobile ? "none" : "1px solid rgba(180,140,90,0.25)",
          boxShadow: "0 8px 40px rgba(74,61,49,0.2)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: isMobile ? "24px 24px 0 0" : 24,
        }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex-shrink-0">
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>
            {isEditing ? "edit this event" : kind === "work" ? "add a work event" : "something to look forward to"}
          </h2>
          {/* Kind toggle */}
          <div
            className="flex mt-3 rounded-xl overflow-hidden"
            style={{ background: "rgba(180,140,90,0.1)", padding: 2, display: "inline-flex" }}
          >
            {(["personal", "work"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className="px-4 py-1 rounded-lg transition-colors"
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 14,
                  background: kind === k ? "var(--paper)" : "transparent",
                  color: kind === k ? "var(--accent)" : "var(--ink-muted)",
                  boxShadow: kind === k ? "0 1px 4px rgba(74,61,49,0.1)" : "none",
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 pb-2">
          {/* Title */}
          <div className="mb-4">
            <input
              type="text"
              placeholder={kind === "work" ? "what's the meeting or task?" : "what are you looking forward to?"}
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (kind === "personal") setUserPickedCharm(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
              className="w-full outline-none bg-transparent"
              style={{
                fontFamily: "var(--font-hand)",
                fontSize: 18,
                color: "var(--ink)",
                borderBottom: "1.5px solid rgba(180,140,90,0.4)",
                paddingBottom: 6,
              }}
            />
          </div>

          {/* Charm section — personal only */}
          {kind === "personal" && (
            <>
              {/* Selected charm preview + auto-suggest label */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex-shrink-0 rounded-xl p-2"
                  style={{ background: "rgba(221,130,38,0.1)", border: "1.5px solid rgba(221,130,38,0.25)" }}
                >
                  <CharmIcon charmId={effectiveCharm} size={52} />
                </div>
                <div>
                  {suggested && !userPickedCharm && (
                    <p style={{ fontFamily: "var(--font-hand)", fontSize: 13, color: "var(--ink-muted)", fontStyle: "italic" }}>
                      suggested for "{title}" — or pick one below
                    </p>
                  )}
                  {(!suggested || userPickedCharm) && (
                    <p style={{ fontFamily: "var(--font-hand)", fontSize: 13, color: "var(--ink-muted)" }}>
                      {CHARM_LIST.find((c) => c.id === effectiveCharm)?.label ?? "Star"}
                    </p>
                  )}
                  {userPickedCharm && (
                    <button
                      onClick={() => setUserPickedCharm(false)}
                      style={{ fontFamily: "var(--font-hand)", fontSize: 12, color: "var(--marker)", textDecoration: "underline" }}
                    >
                      reset to suggested
                    </button>
                  )}
                </div>
              </div>

              {/* Charm search */}
              <input
                type="text"
                placeholder="search charms..."
                value={charmSearch}
                onChange={(e) => setCharmSearch(e.target.value)}
                className="w-full rounded-xl px-3 py-2 outline-none mb-3"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  color: "var(--ink)",
                  background: "rgba(180,140,90,0.08)",
                  border: "1px solid rgba(180,140,90,0.2)",
                }}
              />

              {/* Charm picker — categorised or search results */}
              <div className="mb-4" style={{ maxHeight: 280, overflowY: "auto" }}>
                {charmSearch ? (
                  filteredCharms.length === 0 ? (
                    <p className="text-center py-4" style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-faint)" }}>
                      no charms match &ldquo;{charmSearch}&rdquo;
                    </p>
                  ) : (
                    <div className="grid" style={{ gridTemplateColumns: `repeat(${isMobile ? 4 : 5}, 1fr)`, gap: 6 }}>
                      {filteredCharms.map((charm) => (
                        <CharmButton key={charm.id} charm={charm} selected={charm.id === effectiveCharm} onPick={pickCharm} />
                      ))}
                    </div>
                  )
                ) : (
                  CHARM_CATEGORIES.map((cat) => (
                    <div key={cat.label} className="mb-4">
                      <p style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        color: "var(--ink-faint)",
                        marginBottom: 6,
                      }}>
                        {cat.label}
                      </p>
                      <div className="grid" style={{ gridTemplateColumns: `repeat(${isMobile ? 4 : 5}, 1fr)`, gap: 6 }}>
                        {cat.ids.map((id) => {
                          const charm = CHARMS[id];
                          return <CharmButton key={id} charm={charm} selected={id === effectiveCharm} onPick={pickCharm} />;
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Start date + time */}
          <div className="mb-2">
            <label style={{ fontFamily: "var(--font-hand)", fontSize: 12, color: "var(--ink-faint)", display: "block", marginBottom: 4 }}>start</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="flex-1 rounded-xl px-3 py-2 outline-none"
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 15,
                  color: "var(--ink)",
                  background: "rgba(180,140,90,0.08)",
                  border: "1px solid rgba(180,140,90,0.2)",
                }}
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                required
                className="w-32 rounded-xl px-3 py-2 outline-none"
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 15,
                  color: "var(--ink)",
                  background: "rgba(180,140,90,0.08)",
                  border: `1px solid ${startTime ? "rgba(180,140,90,0.2)" : "rgba(221,130,38,0.45)"}`,
                }}
              />
            </div>
          </div>

          {/* End date + time */}
          <div className="mb-3">
            <label style={{ fontFamily: "var(--font-hand)", fontSize: 12, color: "var(--ink-faint)", display: "block", marginBottom: 4 }}>end</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setEndDateManual(true); }}
                className="flex-1 rounded-xl px-3 py-2 outline-none"
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 15,
                  color: "var(--ink)",
                  background: "rgba(180,140,90,0.08)",
                  border: "1px solid rgba(180,140,90,0.2)",
                }}
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                required
                className="w-32 rounded-xl px-3 py-2 outline-none"
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 15,
                  color: "var(--ink)",
                  background: "rgba(180,140,90,0.08)",
                  border: `1px solid ${endTime ? "rgba(180,140,90,0.2)" : "rgba(221,130,38,0.45)"}`,
                }}
              />
            </div>
          </div>

          {/* Note */}
          <textarea
            placeholder="any notes? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full rounded-xl px-3 py-2 outline-none resize-none mb-4"
            style={{
              fontFamily: "var(--font-hand)",
              fontSize: 15,
              color: "var(--ink)",
              background: "rgba(180,140,90,0.08)",
              border: "1px solid rgba(180,140,90,0.2)",
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 px-6 pb-5 flex-shrink-0">
          <button
            onClick={onClose}
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
            onClick={handleSave}
            disabled={!title.trim() || !startTime || !endTime}
            className="flex-1 rounded-xl py-2.5 transition-all"
            style={{
              fontFamily: "var(--font-hand)",
              fontSize: 16,
              fontWeight: 600,
              background: (title.trim() && startTime && endTime) ? "var(--accent)" : "rgba(180,140,90,0.15)",
              color: (title.trim() && startTime && endTime) ? "#fff" : "var(--ink-faint)",
            }}
          >
            {isEditing ? "save changes ✦" : kind === "work" ? "add work event" : "add to my calendar ✦"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CharmButton({ charm, selected, onPick }: { charm: Charm; selected: boolean; onPick: (id: CharmId) => void }) {
  return (
    <button
      onClick={() => onPick(charm.id)}
      title={charm.label}
      className="flex flex-col items-center rounded-xl py-2 px-1 transition-all"
      style={{
        background: selected ? "rgba(221,130,38,0.15)" : "transparent",
        outline: selected ? "2px solid var(--accent)" : "2px solid transparent",
        outlineOffset: 1,
        gap: 4,
      }}
    >
      <CharmIcon charmId={charm.id} size={40} />
      <span style={{
        fontFamily: "var(--font-sans)",
        fontSize: 10,
        color: selected ? "var(--accent)" : "var(--ink-muted)",
        lineHeight: 1.2,
        textAlign: "center",
        wordBreak: "break-word",
        width: "100%",
      }}>
        {charm.label}
      </span>
    </button>
  );
}
