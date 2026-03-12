pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
    DOCKERHUB_USERNAME = 'your-dockerhub-username'
    FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/devops-task-manager-frontend"
    BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/devops-task-manager-backend"
    IMAGE_TAG = "${BUILD_NUMBER}"
    EC2_SSH_TARGET = 'ec2-user@YOUR_EC2_PUBLIC_DNS'
    EC2_PUBLIC_HOST = 'YOUR_EC2_PUBLIC_DNS'
    EC2_SSH_KEY = 'ec2-ssh-key-id'
  }

  stages {
    stage('Clone Repository') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker build -t $BACKEND_IMAGE:$IMAGE_TAG ./backend'
        sh 'docker build -t $FRONTEND_IMAGE:$IMAGE_TAG --build-arg VITE_API_URL=http://$EC2_PUBLIC_HOST:5000 ./frontend'
      }
    }

    stage('Push Images to DockerHub') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
        sh 'docker push $BACKEND_IMAGE:$IMAGE_TAG'
        sh 'docker push $FRONTEND_IMAGE:$IMAGE_TAG'
        sh 'docker tag $BACKEND_IMAGE:$IMAGE_TAG $BACKEND_IMAGE:latest'
        sh 'docker tag $FRONTEND_IMAGE:$IMAGE_TAG $FRONTEND_IMAGE:latest'
        sh 'docker push $BACKEND_IMAGE:latest'
        sh 'docker push $FRONTEND_IMAGE:latest'
      }
    }

    stage('Deploy on AWS EC2') {
      steps {
        sshagent(credentials: [EC2_SSH_KEY]) {
          sh '''
          ssh -o StrictHostKeyChecking=no $EC2_SSH_TARGET "
            docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW &&
            docker network create dtm-network || true &&
            docker pull $BACKEND_IMAGE:latest &&
            docker pull $FRONTEND_IMAGE:latest &&
            docker rm -f dtm-backend dtm-frontend || true &&
            docker run -d --name dtm-backend --network dtm-network -p 5000:5000 $BACKEND_IMAGE:latest &&
            docker run -d --name dtm-frontend --network dtm-network -p 80:80 $FRONTEND_IMAGE:latest
          "
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
  }
}
