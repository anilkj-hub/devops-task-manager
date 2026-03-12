function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const isCompleted = task.status === 'Completed';

  return (
    <article className="task-card">
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <span className={`badge ${isCompleted ? 'done' : 'pending'}`}>{task.status}</span>
      </div>
      <p>{task.description || 'No description provided.'}</p>
      <div className="task-card-actions">
        <button className="btn" onClick={() => onToggleStatus(task)}>
          Mark as {isCompleted ? 'Pending' : 'Completed'}
        </button>
        <button className="btn" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </article>
  );
}

export default TaskCard;