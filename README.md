# cursor_pub

A minimal full-stack **Notes** app that serves as the starter development
experience for this repository. It is intentionally small but exercises a real
end-to-end flow: a browser frontend talking to an Express JSON API.

## Stack

- **Runtime:** Node.js (>= 20), ES modules
- **Server:** [Express](https://expressjs.com/) with an in-memory notes store
- **Frontend:** static HTML/CSS/vanilla JS served by Express
- **Tests:** Node's built-in test runner (`node --test`)
- **Lint:** ESLint (flat config)

## Getting started

```bash
npm install      # install dependencies
npm start        # run the app on http://localhost:3000
npm run dev      # run with auto-reload (node --watch)
npm test         # run the test suite
npm run lint     # lint the codebase
```

Set `PORT` to change the listening port (defaults to `3000`).

## API

| Method | Path              | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | `/api/health`     | Health check             |
| GET    | `/api/notes`      | List notes (newest first)|
| POST   | `/api/notes`      | Create a note (`{text}`) |
| DELETE | `/api/notes/:id`  | Delete a note by id      |

## Project layout

```
src/        Express app factory, in-memory store, and server entry point
public/     Static frontend (HTML/CSS/JS)
test/       API tests
```

## Cloud Agent environment

`.cursor/environment.json` configures the Cloud Agent development environment:
`npm install` runs on setup and the dev server is started in a persistent
terminal on port `3000`.
