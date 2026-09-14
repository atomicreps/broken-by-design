"use client";

import { createContext, useContext, type ReactNode } from "react";

type Density = "comfortable" | "compact";

const DensityContext = createContext<Density>("comfortable");

function readSavedDensity(): Density {
  if (typeof window === "undefined") return "comfortable";
  return window.localStorage.getItem("desk.density") === "compact"
    ? "compact"
    : "comfortable";
}

export function DensityProvider({ children }: { children: ReactNode }) {
  const density = readSavedDensity();
  return <DensityContext.Provider value={density}>{children}</DensityContext.Provider>;
}

export function useDensity(): Density {
  return useContext(DensityContext);
}

export function DensityToggle() {
  const density = useDensity();
  return (
    <select
      value={density}
      onChange={(event) => {
        window.localStorage.setItem("desk.density", event.target.value);
        window.location.reload();
      }}
    >
      <option value="comfortable">Comfortable</option>
      <option value="compact">Compact</option>
    </select>
  );
}
