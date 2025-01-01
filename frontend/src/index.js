import React, { useEffect, useState, useRef } from 'react'; // Add useRef
import ReactDOM from 'react-dom/client';
import './index.css';

// Task Component
const Task = ({ task, tasks, toggleComplete, deleteTask, addChildTask }) => {
  const childTasks = tasks.filter(t => t.parentId === task.id);

  return (
    <li className={`task ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
      />
      {task.name}
      <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑️</button>
      <button className="add-child-btn" onClick={() => addChildTask(task.id)}>➕</button>
      {childTasks.length > 0 && (
        <ul>
          {childTasks.map(child => (
            <Task
              key={child.id}
              task={child}
              tasks={tasks}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              addChildTask={addChildTask}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// Main App
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dragTask, setDragTask] = useState(null);
  const inputRef = useRef(null);


  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const addTask = (parentId = null) => {
    if (!newTask.trim()) return;
    const task = { name: newTask, completed: false, parentId };
    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
      .then(res => res.json())
      .then(data => {
        setTasks([...tasks, data]);
        setNewTask('');
        inputRef.current.focus();
      })
      .catch(err => console.error('Error adding task:', err));
  };
  

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(err => console.error('Error deleting task:', err));
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDragStart = (task) => {
    setDragTask(task);
  };

  const handleDrop = (targetTask) => {
    if (dragTask && dragTask.id !== targetTask.id) {
      fetch('http://localhost:5000/tasks/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: dragTask.id, newPosition: targetTask.position }),
      })
        .then(() => {
          const reorderedTasks = [...tasks];
          const draggedIndex = tasks.findIndex(t => t.id === dragTask.id);
          const targetIndex = tasks.findIndex(t => t.id === targetTask.id);

          reorderedTasks.splice(draggedIndex, 1);
          reorderedTasks.splice(targetIndex, 0, dragTask);

          setTasks(reorderedTasks);
        })
        .catch(err => console.error('Error reordering tasks:', err));
    }
  };

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <div className="input-container">
        <input
        ref={inputRef}
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={() => addTask(null)}>Add Task</button>
      </div>
      <ul>
        {tasks
          .filter(task => task.parentId === null)
          .map(task => (
            <Task
              key={task.id}
              task={task}
              tasks={tasks}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              addChildTask={addTask}
            />
          ))}
      </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
