from fastapi import APIRouter

from ..db import pool

router = APIRouter()


@router.get("/api/search")
async def search(q: str = "", limit: int = 20):
    """Free-text search across ticket subjects and bodies."""
    if not q:
        return {"results": [], "query": q}

    sql = f"""
        SELECT id, subject, status, priority, requester, created_at
        FROM tickets
        WHERE subject ILIKE '%{q}%' OR body ILIKE '%{q}%'
        ORDER BY created_at DESC
        LIMIT {limit}
    """

    async with pool().acquire() as conn:
        rows = await conn.fetch(sql)

    return {"results": [dict(r) for r in rows], "query": q}
