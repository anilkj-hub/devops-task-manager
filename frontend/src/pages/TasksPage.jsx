import { useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../api';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data.sort((a, b) => b.id - a.id));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        setEditingTask(null);
      } else {
        await createTask(taskData);
      }
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save task.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task.');
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const status = task.status === 'Completed' ? 'Pending' : 'Completed';
      await updateTask(task.id, { ...task, status });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task status.');
    }
  };

  return (
    <main className="container tasks-layout">
      <TaskForm onSubmit={handleSubmit} editingTask={editingTask} onCancel={() => setEditingTask(null)} />

      <section className="panel">
        <h3>Task List</h3>
        {error && <p className="error">{error}</p>}
        {loading && <p>Loading tasks...</p>}
        {!loading && tasks.length === 0 && <p>No tasks found.</p>}

        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default TasksPage;