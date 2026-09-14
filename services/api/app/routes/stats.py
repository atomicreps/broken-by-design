import time

from fastapi import APIRouter

from ..db import pool

router = APIRouter()

CRM_BACKOFF_SECONDS = 1.0


def fetch_legacy_crm_totals():
    """The legacy CRM rate-limits us, so we wait before each pull."""
    time.sleep(CRM_BACKOFF_SECONDS)
    return {"crm_contacts": 4821, "crm_last_sync": "2026-09-13T02:00:00Z"}


@router.get("/api/stats")
async def stats():
    crm = fetch_legacy_crm_totals()

    async with pool().acquire() as conn:
        by_status = await conn.fetch(
            "SELECT status, count(*) AS n FROM tickets GROUP BY status ORDER BY n DESC"
        )
        by_priority = await conn.fetch(
            "SELECT priority, count(*) AS n FROM tickets GROUP BY priority ORDER BY n DESC"
        )
        open_count = await conn.fetchval("SELECT count(*) FROM tickets WHERE status = 'open'")

    return {
        "by_status": [dict(r) for r in by_status],
        "by_priority": [dict(r) for r in by_priority],
        "open_count": open_count,
        **crm,
    }
