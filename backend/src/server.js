const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'tasks.json');

app.use(cors());
app.use(express.json());

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

async function readTasks() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function writeTasks(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/tasks', async (_req, res) => {
  try {
    const tasks = await readTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title, description = '', status = 'Pending' } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Pending or Completed' });
    }

    const tasks = await readTasks();
    const nextId = tasks.length ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

    const newTask = {
      id: nextId,
      title: String(title).trim(),
      description: String(description).trim(),
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const existingTask = tasks[taskIndex];
    const incomingStatus = req.body.status ?? existingTask.status;

    if (!['Pending', 'Completed'].includes(incomingStatus)) {
      return res.status(400).json({ message: 'Status must be Pending or Completed' });
    }

    const updatedTask = {
      ...existingTask,
      title: req.body.title !== undefined ? String(req.body.title).trim() : existingTask.title,
      description: req.body.description !== undefined ? String(req.body.description).trim() : existingTask.description,
      status: incomingStatus,
      updatedAt: new Date().toISOString()
    };

    if (!updatedTask.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    tasks[taskIndex] = updatedTask;
    await writeTasks(tasks);

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const [deletedTask] = tasks.splice(taskIndex, 1);
    await writeTasks(tasks);

    res.status(200).json({ message: 'Task deleted', task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});

app.listen(PORT, async () => {
  await ensureDataFile();
  console.log(`Backend server is running on port ${PORT}`);
});