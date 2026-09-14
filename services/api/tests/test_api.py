import os
import time

import httpx
import pytest

BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8000")


def api_is_up() -> bool:
    try:
        return httpx.get(f"{BASE_URL}/api/health", timeout=2.0).status_code == 200
    except Exception:
        return False


pytestmark = pytest.mark.skipif(not api_is_up(), reason="API is not running")


def test_health():
    assert httpx.get(f"{BASE_URL}/api/health").json()["ok"] is True


def test_ticket_list_returns_a_page():
    body = httpx.get(f"{BASE_URL}/api/tickets", timeout=30.0).json()
    assert body["page_size"] == 25


def test_ticket_list_is_fast():
    start = time.time()
    httpx.get(f"{BASE_URL}/api/tickets", timeout=30.0)
    assert time.time() - start < 5.0


def test_search_finds_password_tickets():
    body = httpx.get(f"{BASE_URL}/api/search", params={"q": "password"}, timeout=30.0).json()
    assert len(body["results"]) > 0
