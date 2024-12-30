const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

// Initialize app and database
const app = express();
const db = new Database('tasks.db');

// Middleware
app.use(cors());
app.use(express.json());

// Create tasks table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
`).run();

// Routes
app.get('/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  const result = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(title);
  res.json({ id: result.lastInsertRowid, title, completed: 0 });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  db.prepare('UPDATE tasks SET title = ?, completed = ? WHERE id = ?').run(title, completed, id);
  res.json({ id, title, completed });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
