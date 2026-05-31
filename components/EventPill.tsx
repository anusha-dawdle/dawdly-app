"use client";

import type { DawdlyEvent } from "@/lib/types";
import CharmIcon from "./CharmIcon";

interface EventPillProps {
  event: DawdlyEvent;
  onDelete?: (id: string) => void;
  stacked?: boolean; // week view: big icon on top, title below
}

export default function EventPill({
  event,
  onDelete,
  stacked = false,
}: EventPillProps) {
  if (stacked) {
    return (
      <div className="group relative flex flex-col items-center gap-0.5 py-2 px-1 w-full">
        <CharmIcon charmId={event.charmId} size={88} />
        <p
          className="text-center leading-tight w-full"
          style={{
            color: "#7C3D1A",
            fontSize: 12,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.title}
        </p>
        {onDelete && (
          <button
            onClick={() => onDelete(event.id)}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-4 h-4 flex items-center justify-center"
            style={{ color: "#B0A090", background: "#F0EBE0", fontSize: 11 }}
            title="Remove"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  // Day view: horizontal layout
  return (
    <div
      className="group flex items-center gap-2 rounded-xl px-3 py-2 w-full relative"
      style={{ background: "#FFFDF9", border: "1.5px solid #F0EBE0" }}
    >
      <CharmIcon charmId={event.charmId} size={32} />
      <div className="flex-1 min-w-0">
        <p
          className="truncate text-sm font-medium leading-tight"
          style={{ color: "#7C3D1A" }}
        >
          {event.title}
        </p>
        {event.startTime && (
          <p className="text-xs mt-0.5" style={{ color: "#B0A090" }}>
            {formatTime(event.startTime)}
          </p>
        )}
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(event.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
          style={{ color: "#B0A090", background: "#F0EBE0", fontSize: 12 }}
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
