// Simple in-memory notes store. Kept separate so it can be unit-tested and
// swapped for a persistent backend later without touching the HTTP layer.

export function createStore() {
  const notes = new Map();
  let nextId = 1;

  return {
    list() {
      return [...notes.values()].sort((a, b) => b.createdAt - a.createdAt);
    },
    add(text) {
      const trimmed = String(text ?? '').trim();
      if (!trimmed) {
        throw new Error('Note text must not be empty');
      }
      const note = { id: nextId++, text: trimmed, createdAt: Date.now() };
      notes.set(note.id, note);
      return note;
    },
    remove(id) {
      return notes.delete(Number(id));
    },
    clear() {
      notes.clear();
      nextId = 1;
    },
  };
}
