"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { DensityToggle } from "./DensityProvider";
import { SearchBar } from "./SearchBar";

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`/?${next.toString()}`);
  }

  return (
    <div className="toolbar">
      <select
        value={params.get("status") ?? ""}
        onChange={(event) => setParam("status", event.target.value)}
      >
        <option value="">All statuses</option>
        <option value="open">Open</option>
        <option value="pending">Pending</option>
        <option value="solved">Solved</option>
        <option value="closed">Closed</option>
      </select>

      <select
        value={params.get("priority") ?? ""}
        onChange={(event) => setParam("priority", event.target.value)}
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      <SearchBar />
      <DensityToggle />
    </div>
  );
}
