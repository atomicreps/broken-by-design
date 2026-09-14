-- Support Desk schema.

CREATE TABLE staff (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  team        TEXT NOT NULL,
  avatar_url  TEXT
);

CREATE TABLE tickets (
  id           SERIAL PRIMARY KEY,
  subject      TEXT NOT NULL,
  body         TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'open',
  priority     TEXT NOT NULL DEFAULT 'normal',
  requester    TEXT NOT NULL,
  assignee_id  INTEGER REFERENCES staff(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  ticket_id  INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author     TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_ticket ON comments (ticket_id);
