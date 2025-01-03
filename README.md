# Task Manager App

A simple task manager application built with React for the frontend and Express with SQLite for the backend. This app allows you to create, manage, and organize tasks with parent-child relationships and reordering features.

---

## Features
- **Add Tasks**: Quickly add new tasks with an intuitive input field.
- **Parent-Child Relationships**: Organize tasks hierarchically with parent-child structures.
- **Task Completion**: Mark tasks as completed with a single click.
- **Reorder Tasks**: Drag and drop tasks to reorder them.
- **Persistent Storage**: Tasks are saved using SQLite for persistent data management.

---

## Requirements
- Node.js (v20.9.0 or later)
- npm (v9.x or later)
- SQLite 3

---

## Setup Instructions

1. **Clone the repository**
```bash
https://github.com/andy-broyles/task-manager.git
cd task-manager
```

2. **Install dependencies**
```bash
npm install
cd frontend
npm install
```

3. **Run the backend server**
```bash
npm run dev
```

4. **Run the frontend**
```bash
cd frontend
npm start
```

---

## Deployment

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Production Server
```bash
npm start
```

---

## API Endpoints

### Base URL: `http://localhost:5000`

- **GET /tasks**: Fetch all tasks.
- **POST /tasks**: Add a new task.
  - Body: `{ name: string, completed: boolean, parentId: number | null }`
- **DELETE /tasks/:id**: Delete a task by ID.
- **PUT /tasks/:id**: Update task completion status.

---

## Screenshots
![Task Manager Screenshot](frontend/public/screenshot.png)

---

## License
This project is licensed under the MIT License.

