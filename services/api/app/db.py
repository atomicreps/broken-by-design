import asyncio
import os

import asyncpg

DATABASE_URL = os.environ.get(
    "DATABASE_URL", "postgresql://desk:desk@db:5432/supportdesk"
)

_pool: asyncpg.Pool | None = None


async def connect(attempts: int = 60, delay: float = 2.0) -> None:
    """Wait for Postgres, which is still loading seed data on a cold start."""
    global _pool
    last: Exception | None = None
    for _ in range(attempts):
        try:
            _pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
            return
        except (OSError, asyncpg.PostgresError) as error:
            last = error
            await asyncio.sleep(delay)
    raise RuntimeError(f"could not reach Postgres at {DATABASE_URL}") from last


async def disconnect() -> None:
    if _pool is not None:
        await _pool.close()


def pool() -> asyncpg.Pool:
    if _pool is None:
        raise RuntimeError("database pool is not ready")
    return _pool
