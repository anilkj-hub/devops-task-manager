import { useEffect, useState } from 'react';

const emptyState = {
  title: '',
  description: '',
  status: 'Pending'
};

function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [formData, setFormData] = useState(emptyState);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status
      });
    } else {
      setFormData(emptyState);
    }
  }, [editingTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    if (!editingTask) {
      setFormData(emptyState);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h3>{editingTask ? 'Update Task' : 'Add Task'}</h3>
      <label>
        Title
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter task title"
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Enter task details"
        />
      </label>

      <label>
        Status
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </label>

      <div className="actions">
        <button type="submit" className="btn primary">
          {editingTask ? 'Save Changes' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;