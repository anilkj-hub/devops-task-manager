import { useEffect, useState } from 'react';
import { getTasks } from '../api';

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard data.');
      }
    };

    loadTasks();
  }, []);

  const completed = tasks.filter((task) => task.status === 'Completed').length;
  const pending = tasks.length - completed;

  return (
    <main className="container">
      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <strong>{tasks.length}</strong>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <strong>{pending}</strong>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <strong>{completed}</strong>
        </div>
      </section>

      <section className="panel">
        <h3>Recent Tasks</h3>
        {error && <p className="error">{error}</p>}
        {!error && tasks.length === 0 && <p>No tasks yet. Start by creating one.</p>}
        {!error && tasks.slice(0, 5).map((task) => (
          <div className="recent-task" key={task.id}>
            <span>{task.title}</span>
            <span className={`badge ${task.status === 'Completed' ? 'done' : 'pending'}`}>{task.status}</span>
          </div>
        ))}
      </section>
    </main>
  );
}

export default DashboardPage;