"use client";

import { useEffect, useState } from "react";

import { PUBLIC_API_BASE } from "@/lib/api";

type Stats = {
  open_count: number;
  by_status: { status: string; n: number }[];
  by_priority: { priority: string; n: number }[];
  crm_contacts: number;
};

export function StatsStrip() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch(`${PUBLIC_API_BASE}/api/stats`)
      .then((res) => res.json())
      .then(setStats)
      .catch(() => undefined);
  }, []);

  if (stats === null) return null;

  return (
    <div className="stats-strip">
      {stats.by_status.slice(0, 4).map((row) => (
        <div className="stat" key={row.status}>
          <strong>{Number(row.n).toLocaleString("en-GB")}</strong>
          <span>{row.status}</span>
        </div>
      ))}
      <div className="stat">
        <strong>{stats.by_priority.length}</strong>
        <span>priority values</span>
      </div>
      <div className="stat">
        <strong>{stats.crm_contacts.toLocaleString("en-GB")}</strong>
        <span>CRM contacts</span>
      </div>
    </div>
  );
}
