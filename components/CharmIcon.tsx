"use client";

import Image from "next/image";
import { CHARMS, resolveCharmId, DEFAULT_CHARM_ID } from "@/lib/charms";

interface CharmIconProps {
  charmId: string;
  size?: number;
  className?: string;
}

export default function CharmIcon({
  charmId,
  size = 40,
  className = "",
}: CharmIconProps) {
  const resolved = resolveCharmId(charmId);
  const charm = CHARMS[resolved] ?? CHARMS[DEFAULT_CHARM_ID];
  const src = `/pngs/${encodeURIComponent(charm.file)}`;

  return (
    <span
      className={className}
      style={{ display: "inline-block", width: size, height: size, flexShrink: 0, position: "relative" }}
    >
      <Image
        src={src}
        alt={charm.label}
        fill
        style={{ objectFit: "contain", objectPosition: "bottom" }}
        sizes={`${size}px`}
        priority={false}
      />
    </span>
  );
}
