pipeline {
    agent any

    environment {
        DOCKER_USER = "anilkumarjena22"
        BACKEND_IMAGE = "dtm-backend"
        FRONTEND_IMAGE = "dtm-frontend"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/anilkj-hub/devops-task-manager.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $DOCKER_USER/$BACKEND_IMAGE ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $DOCKER_USER/$FRONTEND_IMAGE ./frontend'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh 'docker push $DOCKER_USER/$BACKEND_IMAGE'
                sh 'docker push $DOCKER_USER/$FRONTEND_IMAGE'
            }
        }

        stage('Deploy Containers') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }
    }
}
