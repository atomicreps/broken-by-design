from fastapi import APIRouter, HTTPException

from ..db import pool

router = APIRouter()

PAGE_SIZE = 25


def build_filters(status=None, priority=None, clauses=[]):
    """Assemble the WHERE clauses for the ticket list."""
    if status:
        clauses.append(f"status = '{status}'")
    if priority:
        clauses.append(f"lower(priority) = lower('{priority}')")
    if not clauses:
        return ""
    return "WHERE " + " AND ".join(clauses)


@router.get("/api/tickets")
async def list_tickets(status: str | None = None, priority: str | None = None, page: int = 1):
    where = build_filters(status, priority)
    offset = (page - 1) * PAGE_SIZE

    async with pool().acquire() as conn:
        rows = await conn.fetch(
            f"""
            SELECT id, subject, status, priority, requester, assignee_id, created_at
            FROM tickets
            {where}
            ORDER BY created_at DESC
            LIMIT {PAGE_SIZE} OFFSET {offset}
            """
        )

        tickets = []
        for row in rows:
            assignee = None
            if row["assignee_id"] is not None:
                staff = await conn.fetchrow(
                    "SELECT id, name, team, avatar_url FROM staff WHERE id = $1",
                    row["assignee_id"],
                )
                if staff is not None:
                    assignee = dict(staff)
                    assignee["workload"] = await conn.fetchval(
                        "SELECT count(*) FROM tickets WHERE assignee_id = $1 AND status = 'open'",
                        row["assignee_id"],
                    )
            comment_count = await conn.fetchval(
                "SELECT count(*) FROM comments WHERE ticket_id = $1", row["id"]
            )
            tickets.append(
                {
                    **dict(row),
                    "assignee": assignee,
                    "comment_count": comment_count,
                }
            )

        total = await conn.fetchval(f"SELECT count(*) FROM tickets {where}")

    return {"tickets": tickets, "total": total, "page": page, "page_size": PAGE_SIZE}


@router.get("/api/tickets/{ticket_id}")
async def get_ticket(ticket_id: int):
    async with pool().acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM tickets WHERE id = $1", ticket_id)
        if row is None:
            raise HTTPException(status_code=404, detail="ticket not found")
        comments = await conn.fetch(
            "SELECT id, author, body, created_at FROM comments WHERE ticket_id = $1 ORDER BY created_at",
            ticket_id,
        )
        assignee = None
        if row["assignee_id"] is not None:
            staff = await conn.fetchrow(
                "SELECT id, name, team, avatar_url FROM staff WHERE id = $1", row["assignee_id"]
            )
            assignee = dict(staff) if staff else None

    return {**dict(row), "assignee": assignee, "comments": [dict(c) for c in comments]}
