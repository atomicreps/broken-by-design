"use client";

import { useRef, useState } from "react";

import { PUBLIC_API_BASE } from "@/lib/api";

type Hit = { id: number; subject: string; status: string };

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  async function runSearch(term: string) {
    if (!term) {
      setHits([]);
      return;
    }
    const res = await fetch(
      `${PUBLIC_API_BASE}/api/search?q=${encodeURIComponent(term)}`,
    );
    const body = await res.json();
    setHits(body.results ?? []);
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      runSearch(query);
    }, 300);
  }

  return (
    <>
      <input
        type="search"
        placeholder="Search tickets"
        value={query}
        onChange={onChange}
      />
      {hits.length > 0 ? (
        <span className="ticket-meta">{hits.length} matches</span>
      ) : null}
    </>
  );
}
