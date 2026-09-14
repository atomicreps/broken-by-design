const API_BASE = process.env.API_BASE_URL ?? "http://api:8000";

export const PUBLIC_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type Staff = {
  id: number;
  name: string;
  team: string;
  avatar_url: string | null;
};

export type Ticket = {
  id: number;
  subject: string;
  status: string;
  priority: string;
  requester: string;
  created_at: string;
  assignee: Staff | null;
  comment_count: number;
};

export type TicketPage = {
  tickets: Ticket[];
  total: number;
  page: number;
  page_size: number;
};

export async function fetchTickets(params: {
  status?: string;
  priority?: string;
  page?: number;
}): Promise<TicketPage> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.priority) query.set("priority", params.priority);
  if (params.page) query.set("page", String(params.page));

  const res = await fetch(`${API_BASE}/api/tickets?${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`ticket list failed: ${res.status}`);
  return res.json();
}
