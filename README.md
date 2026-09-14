# Support Desk

An internal ticket triage tool. It works. It is also wrong in twelve ways,
on purpose.

This repo exists so you can feel what it is like to fix real problems with a
coding agent and get asked about them afterwards. Clone it, start it, pick
something that annoys you, and paste the prompt that goes with it. If you have
[Atomic Reps](https://atomicreps.com/coding-agent) installed, a question about
what you just did arrives when the work is done.

## Run it

```bash
git clone https://github.com/atomicreps/broken-by-design.git
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

### What the wizard is actually asking

`setup` asks which areas you want. That choice **orders** what you get, it does
not fence it. If your session touched SQL, you get SQL questions whether or not
you ticked Data. The areas decide what comes first when one session touched
several things, and what you get when there is nothing useful to go on.

Worth knowing here, because this repo spans seven areas on purpose: Frontend,
Backend, Data & Analytics, Testing & Quality, Security, DevOps & Infrastructure,
and Design & UI. Ticking only Frontend will not stop a Postgres question
arriving after you fix the slow query. If you want a topic gone rather than deprioritised, mute it: tell the
agent "never Terraform" and it stays gone.

You can skip the wizard entirely. The defaults are fine for this.

## The twelve things

Each one below is a symptom you can see for yourself, and a prompt you can
paste straight into your agent. The prompts say what you would notice. None of
them say what is actually wrong, because working that out is the exercise.

Change the wording. Complain about it in your own words. That works better.

### 1. The queue takes over a second to load

Every time. Even filtered. Even on page two.

```
The ticket list takes over a second to load every single time, even when I
filter it. Work out why and fix it.
```

### 2. Timestamps change after the page loads

Watch the "opened" dates. They settle on one value, then flip to another. The
dev overlay in the corner lights up at the same moment.

```
When this page loads, the timestamps change a second later and a red error
badge appears in the corner. What is going on?
```

### 3. The page jumps twice while it settles

The row you were about to click moves out from under you.

```
This page jumps around while it is loading and the row I am about to click
moves. Stop that from happening.
```

### 4. Search is one keystroke behind

Type `password` with the network tab open. Watch it ask for `passwor`.

```
The search box is always one character behind what I type. Fix it.
```

### 5. Filtering twice empties the queue

Pick a status. Then pick a different one. Everything disappears, for everyone,
until the API restarts.

```
If I pick a status filter and then pick a different one, the queue goes empty
and never comes back. Everyone sees it empty. Sort this out.
```

### 6. The dashboard reports seven priorities

The product has four.

```
The dashboard says we have 7 priority values. We have 4. Fix the data, and
make sure it cannot drift again.
```

### 7. The search box hands out staff email addresses

Paste this into it and read what comes back:

```
zzz%' UNION SELECT id, email, team, 'x', 'y', now() FROM staff --zz
```

Then ask:

```
Someone pasted a weird string into our ticket search and got a list of staff
email addresses back. Is that as bad as I think it is?
```

### 8. One person opening stats freezes it for everyone

Five people loading the stats panel at once takes five times as long as one.

```
When one person opens the stats panel, everyone else's requests hang until it
finishes. Why does that happen?
```

### 9. You cannot reach a single ticket with the keyboard

Tab through the page and count how many rows you land on. It is zero.

```
I cannot get to any ticket with the keyboard. Tab skips the entire list. Make
the queue usable without a mouse.
```

### 10. The status badges are hard to read

Several people on a normal team will not be able to read them at all.

```
A couple of people on my team say they cannot read the status badges. Have a
look at this.
```

### 11. The test suite is green

Run `docker compose exec api python -m pytest`. Seven tests pass. Everything
above is still true.

```
The test suite is green but this app clearly is not fine. Tell me what these
tests are actually checking, then make them worth having.
```

### 12. Changing one line rebuilds every dependency

```
Every time I change one line of Python, Docker reinstalls every dependency and
it takes forever. Fix the build.
```

## Getting the most out of it

Fix one thing at a time. Run the tests after each one. Resist the urge to let
your agent fix six things in one pass, because one rep about six things is
worth less than six reps about one thing each.

If you would rather work without the crutch, skip the prompt blocks entirely
and just describe what is annoying you. That is what the tool is built for.

## Notes

- Item 5 poisons the API until it restarts. Saving any Python file restarts it,
  so it usually clears itself while you work. `docker compose restart api`
  forces it.
- `docker compose down -v` wipes the database and reseeds from scratch.
- The seed data is generated. Every email address in here is fake.

## Licence

MIT. Take it apart.
