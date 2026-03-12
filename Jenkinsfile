pipeline {
    agent any

    environment {
        DOCKER_USER = "anilkumarjena22"
    }

    stages {

        stage('Build Backend Image') {
            steps {
                bat 'docker build -t %DOCKER_USER%/dtm-backend ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t %DOCKER_USER%/dtm-frontend ./frontend'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    bat 'docker login -u %USER% -p %PASS%'
                }
            }
        }

        stage('Push Images') {
            steps {
                bat 'docker push %DOCKER_USER%/dtm-backend'
                bat 'docker push %DOCKER_USER%/dtm-frontend'
            }
        }

    }
}
