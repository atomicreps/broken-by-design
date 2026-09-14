INSERT INTO staff (name, email, team, avatar_url) VALUES
  ('Ada Okonkwo',    'ada@supportdesk.test',    'Tier 2',       '/avatars/1.svg'),
  ('Bruno Salgado',  'bruno@supportdesk.test',  'Tier 1',       '/avatars/2.svg'),
  ('Cai Wen',        'cai@supportdesk.test',    'Billing',      '/avatars/3.svg'),
  ('Dara Lindqvist', 'dara@supportdesk.test',   'Tier 2',       '/avatars/4.svg'),
  ('Emeka Nwosu',    'emeka@supportdesk.test',  'Escalations',  '/avatars/5.svg'),
  ('Fanny Mercier',  'fanny@supportdesk.test',  'Tier 1',       '/avatars/6.svg');

-- Priority arrives from three different intake forms, so the casing is a mess.
INSERT INTO tickets (subject, body, status, priority, requester, assignee_id, created_at, updated_at)
SELECT
  (ARRAY[
    'Cannot reset my password',
    'Invoice charged twice in March',
    'Export to CSV times out',
    'SSO login loops back to the sign-in page',
    'Mobile app crashes on the settings tab',
    'Webhook deliveries stopped overnight',
    'Seat count wrong after downgrade',
    'Attachments over 10MB are rejected silently',
    'Dark mode ignores my system setting',
    'Search returns results from a deleted workspace'
  ])[1 + (i % 10)],
  'Reported via the web form. Steps to reproduce are in the thread below.',
  (ARRAY['open','open','open','pending','solved','closed'])[1 + (i % 6)],
  (ARRAY['low','normal','high','High','HIGH','urgent','Normal'])[1 + (i % 7)],
  'customer' || i || '@example.test',
  1 + (i % 6),
  now() - (i || ' minutes')::interval,
  now() - (i || ' minutes')::interval
FROM generate_series(1, 1000000) AS i;

INSERT INTO comments (ticket_id, author, body, created_at)
SELECT
  1 + (i % 1000000),
  'agent',
  'Asked the customer for a HAR file.',
  now() - (i || ' minutes')::interval
FROM generate_series(1, 500000) AS i;

ANALYZE;
