# DevOps Task Manager

Full-stack task management application with:
- **Frontend:** React + Vite + Axios
- **Backend:** Node.js + Express
- **Database:** JSON file (`backend/data/tasks.json`)
- **Containerization:** Docker + Docker Compose
- **CI/CD:** Jenkins pipeline to build/push/deploy containers to AWS EC2

## Folder Structure

```text
DevOps Task Manager/
|-- backend/
|   |-- data/
|   |   `-- tasks.json
|   |-- src/
|   |   `-- server.js
|   |-- .dockerignore
|   |-- Dockerfile
|   `-- package.json
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |   |-- Navbar.jsx
|   |   |   |-- ProtectedRoute.jsx
|   |   |   |-- TaskCard.jsx
|   |   |   `-- TaskForm.jsx
|   |   |-- pages/
|   |   |   |-- DashboardPage.jsx
|   |   |   |-- LoginPage.jsx
|   |   |   `-- TasksPage.jsx
|   |   |-- api.js
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- .dockerignore
|   |-- .env.example
|   |-- Dockerfile
|   |-- index.html
|   |-- nginx.conf
|   |-- package.json
|   `-- vite.config.js
|-- docker-compose.yml
|-- Jenkinsfile
`-- README.md
```

## Backend API Endpoints

- `GET /tasks` -> Fetch all tasks
- `POST /tasks` -> Create a new task
- `PUT /tasks/:id` -> Update a task
- `DELETE /tasks/:id` -> Delete a task

Optional health endpoint:
- `GET /health`

## Run Locally (Without Docker)

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on: `http://localhost:3000`

## Run Locally (With Docker)

From project root:

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost` (port 80)
- Backend: `http://localhost:5000`

Stop:

```bash
docker compose down
```

## Docker Build Commands

### Backend Image

```bash
docker build -t devops-task-manager-backend:latest ./backend
```

### Frontend Image

```bash
docker build -t devops-task-manager-frontend:latest --build-arg VITE_API_URL=http://localhost:5000 ./frontend
```

## AWS EC2 Deployment (Manual)

### 1) Provision EC2
- Launch Ubuntu/Amazon Linux EC2 instance.
- Open inbound ports: **22**, **80**, **5000**.
- Install Docker:

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

(Re-login after adding user to docker group.)

### 2) Push Images to DockerHub

```bash
docker login
docker tag devops-task-manager-backend:latest <dockerhub-user>/devops-task-manager-backend:latest
docker tag devops-task-manager-frontend:latest <dockerhub-user>/devops-task-manager-frontend:latest
docker push <dockerhub-user>/devops-task-manager-backend:latest
docker push <dockerhub-user>/devops-task-manager-frontend:latest
```

### 3) Deploy on EC2

```bash
docker network create dtm-network || true
docker pull <dockerhub-user>/devops-task-manager-backend:latest
docker pull <dockerhub-user>/devops-task-manager-frontend:latest
docker rm -f dtm-backend dtm-frontend || true
docker run -d --name dtm-backend --network dtm-network -p 5000:5000 <dockerhub-user>/devops-task-manager-backend:latest
docker run -d --name dtm-frontend --network dtm-network -p 80:80 <dockerhub-user>/devops-task-manager-frontend:latest
```

Access app at `http://<EC2_PUBLIC_IP>`.

## Jenkins CI/CD Setup

`Jenkinsfile` stages:
1. Clone repository
2. Build Docker images
3. Push images to DockerHub
4. Deploy containers to AWS EC2

### Required Jenkins Credentials
- `dockerhub-creds` (Username + Password)
- `ec2-ssh-key-id` (SSH private key for EC2)

### Update Before Running Pipeline
- Set `DOCKERHUB_USERNAME` in `Jenkinsfile`
- Set `EC2_SSH_TARGET` in `Jenkinsfile` (`ec2-user@<public-dns-or-ip>`)
- Set `EC2_PUBLIC_HOST` in `Jenkinsfile` (`<public-dns-or-ip>`)
- Ensure Jenkins agent has Docker CLI and SSH agent plugin available.

## Notes
- Login is UI-level demo auth using `localStorage`.
- Persistent tasks are saved in `backend/data/tasks.json`.
- For production-grade auth and data storage, replace demo login and JSON file with JWT + MongoDB/PostgreSQL.
