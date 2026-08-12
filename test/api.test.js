import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

// Boots the app on an ephemeral port and returns the base URL plus a closer.
async function startServer() {
  const app = createApp();
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

test('health endpoint reports ok', async () => {
  const { baseUrl, close } = await startServer();
  try {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
  } finally {
    await close();
  }
});

test('notes can be created, listed, and deleted', async () => {
  const { baseUrl, close } = await startServer();
  try {
    let res = await fetch(`${baseUrl}/api/notes`);
    assert.deepEqual(await res.json(), []);

    res = await fetch(`${baseUrl}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'hello world' }),
    });
    assert.equal(res.status, 201);
    const created = await res.json();
    assert.equal(created.text, 'hello world');
    assert.ok(created.id);

    res = await fetch(`${baseUrl}/api/notes`);
    const list = await res.json();
    assert.equal(list.length, 1);

    res = await fetch(`${baseUrl}/api/notes/${created.id}`, { method: 'DELETE' });
    assert.equal(res.status, 204);

    res = await fetch(`${baseUrl}/api/notes`);
    assert.deepEqual(await res.json(), []);
  } finally {
    await close();
  }
});

test('empty note text is rejected', async () => {
  const { baseUrl, close } = await startServer();
  try {
    const res = await fetch(`${baseUrl}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '   ' }),
    });
    assert.equal(res.status, 400);
  } finally {
    await close();
  }
});

test('deleting a missing note returns 404', async () => {
  const { baseUrl, close } = await startServer();
  try {
    const res = await fetch(`${baseUrl}/api/notes/9999`, { method: 'DELETE' });
    assert.equal(res.status, 404);
  } finally {
    await close();
  }
});
