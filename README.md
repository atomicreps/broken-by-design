# Support Desk

An internal ticket triage tool. It works. It is also wrong in about a dozen
ways, on purpose.

This repo exists so you can feel what it is like to fix real problems with a
coding agent and get asked about them afterwards. Clone it, start it, find
something that annoys you, and ask your agent to fix it in whatever words you
would normally use. If you have [Atomic Reps](https://atomicreps.com/coding-agent)
installed, a question about what you just did arrives when the work is done.

## Run it

```bash
git clone https://github.com/thepedroferrari/broken-by-design.git
cd broken-by-design
docker compose up
```

Then open http://localhost:3000.

First boot seeds a million tickets, so give it a minute. After that the web app
and the API both hot reload, so your fixes show up straight away.

| Service | URL | Stack |
| --- | --- | --- |
| Web | http://localhost:3000 | Next.js 16, React 19, TypeScript |
| API | http://localhost:8000 | FastAPI, Python 3.12, asyncpg |
| Database | localhost:5433 | Postgres 17 |

API docs are at http://localhost:8000/docs. Database credentials are
`desk` / `desk` / `supportdesk`.

## Get the reps

```bash
npx atomicreps login      # type the code it prints at atomicreps.com/connect
npx atomicreps setup      # pick what you want to practise, and how often
npx atomicreps connect    # wire it into Claude Code, Cursor or Codex
```

Fixing something here without this installed still teaches you something. It
just teaches you less, because nobody asks you about it three days later.

The free plan gives you three questions a day in the agent, at the first
difficulty of each topic. There is more broken in here than three questions
covers, which is rather the point.

## What is wrong with it

Every item below is a real symptom you can see for yourself. None of them say
what the cause is, because working that out with your agent is the exercise.

**The queue**

1. The ticket list takes well over a second to load. Every time. Even filtered.
2. Timestamps change the instant the page finishes loading, and the dev overlay
   in the corner lights up.
3. The page jumps twice while it settles. The list you were about to click moves.
4. Search is always one keystroke behind. Type `password` and watch the network
   tab ask for `passwor`.
5. Pick a status filter. Then pick a different one. The queue empties, and stays
   empty for everyone until the API restarts.

**The data**

6. The dashboard reports seven priority values. The product has four.
7. Paste `zzz%' UNION SELECT id, email, team, 'x', 'y', now() FROM staff --`
   into the search box. Read what comes back.

**The rest of it**

8. Open the stats panel and every other request to the API waits for it. Five
   people loading stats at once takes five times as long as one.
9. You cannot reach a single ticket with the keyboard. Tab through the page and
   count how many rows you land on.
10. The status badges are washed out enough that some people cannot read them.
11. `python -m pytest` is green. All of the above is still true.
12. Changing one line of Python rebuilds every dependency in the image.

## How to play

Ask for what you want in your own words, the way you would on a Tuesday
afternoon. "Why does this page jump around when it loads." "The queue goes
empty after I filter it, sort that out." "This list is too slow."

Do not paste the numbered list above into your agent. Half the value is in
describing a symptom badly and watching a good agent find the real cause.

If you want the exercise to bite, fix one thing at a time and run
`docker compose exec api python -m pytest` after each one.

## Notes

- Item 5 poisons the API until it restarts. Saving any Python file restarts it,
  so it usually clears itself while you work. `docker compose restart api`
  forces it.
- `docker compose down -v` wipes the database and reseeds from scratch.
- The seed data is generated. Every email address in here is fake.

## Licence

MIT. Take it apart.
