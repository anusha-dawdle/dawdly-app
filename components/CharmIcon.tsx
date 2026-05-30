"use client";

import type { CharmId } from "@/lib/types";
import { CHARMS } from "@/lib/charms";

interface CharmIconProps {
  charmId: CharmId;
  size?: number;
  className?: string;
}

export default function CharmIcon({
  charmId,
  size = 40,
  className = "",
}: CharmIconProps) {
  const charm = CHARMS[charmId];
  if (!charm) return null;
  return (
    <span
      className={className}
      style={{ display: "inline-block", width: size, height: size, flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: charm.svg }}
    />
  );
}
