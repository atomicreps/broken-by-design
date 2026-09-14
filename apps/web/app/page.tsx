import { Announcement } from "@/components/Announcement";
import { FilterBar } from "@/components/FilterBar";
import { StatsStrip } from "@/components/StatsStrip";
import { TicketRow } from "@/components/TicketRow";
import { fetchTickets } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const one = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const page = Number(one("page") ?? "1") || 1;
  const data = await fetchTickets({
    status: one("status"),
    priority: one("priority"),
    page,
  });

  const lastPage = Math.max(1, Math.ceil(data.total / data.page_size));
  const query = (target: number) => {
    const next = new URLSearchParams();
    const status = one("status");
    const priority = one("priority");
    if (status) next.set("status", status);
    if (priority) next.set("priority", priority);
    next.set("page", String(target));
    return `/?${next.toString()}`;
  };

  return (
    <>
      <header className="masthead">
        <div>
          <h1>Support Desk</h1>
          <p>Internal ticket triage</p>
        </div>
        <p>
          {data.total.toLocaleString("en-GB")} tickets
        </p>
      </header>

      <Announcement />
      <StatsStrip />
      <FilterBar />

      <div className="ticket-list">
        {data.tickets.length === 0 ? (
          <div className="empty">No tickets match these filters.</div>
        ) : (
          data.tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)
        )}
      </div>

      <div className="pager">
        {page > 1 ? <a href={query(page - 1)}>Previous</a> : null}
        <span className="ticket-meta">
          Page {page} of {lastPage}
        </span>
        {page < lastPage ? <a href={query(page + 1)}>Next</a> : null}
      </div>
    </>
  );
}
