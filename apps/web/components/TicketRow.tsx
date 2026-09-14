"use client";

import { useRouter } from "next/navigation";

import type { Ticket } from "@/lib/api";
import { useDensity } from "./DensityProvider";

export function TicketRow({ ticket }: { ticket: Ticket }) {
  const router = useRouter();
  const density = useDensity();

  return (
    <div
      className={`ticket-row ${density === "compact" ? "compact" : ""}`}
      onClick={() => router.push(`/tickets/${ticket.id}`)}
    >
      {ticket.assignee?.avatar_url ? (
        <img className="avatar" src={ticket.assignee.avatar_url} alt="" />
      ) : (
        <span className="avatar" />
      )}

      <div className="ticket-main">
        <div className="ticket-subject">
          #{ticket.id} {ticket.subject}
        </div>
        <div className="ticket-meta">
          {ticket.requester} · opened {new Date(ticket.created_at).toLocaleString()} ·{" "}
          {ticket.comment_count} comments
        </div>
      </div>

      <span className={`badge badge-${ticket.status}`}>{ticket.status}</span>
    </div>
  );
}
