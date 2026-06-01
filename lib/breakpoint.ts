"use client";

import { useState, useEffect } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

function get(): Breakpoint {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 640) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");
  useEffect(() => {
    setBp(get());
    const handler = () => setBp(get());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return bp;
}
