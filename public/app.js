const notesEl = document.getElementById('notes');
const emptyEl = document.getElementById('empty');
const formEl = document.getElementById('note-form');
const inputEl = document.getElementById('note-input');
const statusEl = document.getElementById('status');

function setStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = `status status--${kind}`;
}

function render(notes) {
  notesEl.replaceChildren();
  emptyEl.hidden = notes.length > 0;

  for (const note of notes) {
    const li = document.createElement('li');
    li.className = 'note';
    li.dataset.id = note.id;

    const text = document.createElement('span');
    text.className = 'note__text';
    text.textContent = note.text;

    const del = document.createElement('button');
    del.className = 'note__delete';
    del.type = 'button';
    del.setAttribute('aria-label', 'Delete note');
    del.textContent = '×';
    del.addEventListener('click', () => deleteNote(note.id));

    li.append(text, del);
    notesEl.append(li);
  }
}

async function loadNotes() {
  try {
    const res = await fetch('/api/notes');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    render(await res.json());
    setStatus('connected', 'ok');
  } catch (err) {
    setStatus('offline', 'error');
    console.error(err);
  }
}

async function addNote(text) {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await loadNotes();
}

async function deleteNote(id) {
  const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);
  await loadNotes();
}

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = '';
  try {
    await addNote(text);
  } catch (err) {
    setStatus('failed to save', 'error');
    console.error(err);
  }
});

loadNotes();
