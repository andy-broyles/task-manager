const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

// Initialize app and database
const app = express();
const db = new Database('tasks.db');

// Middleware
app.use(cors());
app.use(express.json());

// Create tasks table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    parentId INTEGER DEFAULT NULL,
    position INTEGER
  )
`).run();

// GET all tasks
app.get('/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY position').all();
  res.json(tasks);
});

// POST a new task
app.post('/tasks', (req, res) => {
  const { name, completed, parentId } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Task name is required' });
  }

  const stmt = db.prepare('INSERT INTO tasks (name, completed, parentId, position) VALUES (?, ?, ?, ?)');
  const info = stmt.run(name, completed ? 1 : 0, parentId || null, Date.now());

  const newTask = {
    id: info.lastInsertRowid,
    name,
    completed: completed || false,
    parentId: parentId || null,
    position: Date.now(),
  };

  res.status(201).json(newTask);
});

// PUT (Update a task)
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { name, completed } = req.body;

  const stmt = db.prepare('UPDATE tasks SET name = ?, completed = ? WHERE id = ?');
  stmt.run(name, completed ? 1 : 0, id);

  res.json({ id, name, completed });
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.json({ success: true });
});

// REORDER tasks
app.put('/tasks/reorder', (req, res) => {
  const { taskId, newPosition } = req.body;

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare('UPDATE tasks SET position = ? WHERE id = ?').run(newPosition, taskId);
  res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
