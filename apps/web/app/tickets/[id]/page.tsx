import Link from "next/link";

const API_BASE = process.env.API_BASE_URL ?? "http://api:8000";

type Comment = { id: number; author: string; body: string; created_at: string };

export const dynamic = "force-dynamic";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${API_BASE}/api/tickets/${id}`, { cache: "no-store" });

  if (!res.ok) {
    return (
      <>
        <p>
          <Link href="/">Back to the queue</Link>
        </p>
        <p>Ticket {id} was not found.</p>
      </>
    );
  }

  const ticket = await res.json();

  return (
    <>
      <p>
        <Link href="/">Back to the queue</Link>
      </p>

      <header className="masthead">
        <div>
          <h1>
            #{ticket.id} {ticket.subject}
          </h1>
          <p>
            {ticket.requester} · {ticket.priority} · assigned to{" "}
            {ticket.assignee?.name ?? "nobody"}
          </p>
        </div>
        <span className={`badge badge-${ticket.status}`}>{ticket.status}</span>
      </header>

      <div className="ticket-list">
        <div className="ticket-row" style={{ cursor: "default" }}>
          <div className="ticket-main">{ticket.body}</div>
        </div>
        {(ticket.comments as Comment[]).map((comment) => (
          <div key={comment.id} className="ticket-row" style={{ cursor: "default" }}>
            <div className="ticket-main">
              <div className="ticket-subject">{comment.author}</div>
              <div className="ticket-meta">{comment.body}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
