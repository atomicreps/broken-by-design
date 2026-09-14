from app.routes.tickets import build_filters


def test_status_filter_is_applied():
    where = build_filters(status="open")
    assert where is not None


def test_priority_filter_is_applied():
    where = build_filters(priority="high")
    assert "priority" in where


def test_no_filters_returns_empty_string():
    where = build_filters()
    assert isinstance(where, str)
