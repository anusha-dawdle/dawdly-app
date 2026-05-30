"use client";

import type { DawdlyEvent } from "@/lib/types";
import CharmIcon from "./CharmIcon";
import { CHARMS } from "@/lib/charms";

interface EventPillProps {
  event: DawdlyEvent;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export default function EventPill({
  event,
  onDelete,
  compact = false,
}: EventPillProps) {
  const charm = CHARMS[event.charmId];

  return (
    <div
      className="group flex items-center gap-1.5 rounded-xl px-2 py-1 w-full relative"
      style={{
        background: "#FFFDF9",
        border: "1.5px solid #F0EBE0",
        minHeight: compact ? 28 : 36,
      }}
    >
      <CharmIcon charmId={event.charmId} size={compact ? 22 : 28} />
      <div className="flex-1 min-w-0">
        <p
          className="truncate text-xs font-medium leading-tight"
          style={{ color: "#2D2017" }}
        >
          {event.title}
        </p>
        {!compact && event.startTime && (
          <p className="text-xs" style={{ color: "#B0A090" }}>
            {formatTime(event.startTime)}
          </p>
        )}
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(event.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0"
          style={{ color: "#B0A090", background: "#F0EBE0" }}
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}
