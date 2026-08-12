import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createStore } from './store.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Builds the Express application. Exported as a factory so tests can create an
// isolated instance with its own store instead of sharing global state.
export function createApp({ store = createStore() } = {}) {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.get('/api/notes', (_req, res) => {
    res.json(store.list());
  });

  app.post('/api/notes', (req, res) => {
    try {
      const note = store.add(req.body?.text);
      res.status(201).json(note);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/notes/:id', (req, res) => {
    const removed = store.remove(req.params.id);
    if (!removed) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    res.status(204).end();
  });

  app.use(express.static(join(__dirname, '..', 'public')));

  return app;
}
