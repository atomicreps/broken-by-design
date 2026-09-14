"use client";

import { useEffect, useState } from "react";

export function Announcement() {
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setNotice(
      "Scheduled maintenance on Sunday 02:00-04:00 UTC. Ticket creation will be paused.",
    );
  }, []);

  if (notice === null) return null;

  return <div className="announcement">{notice}</div>;
}
