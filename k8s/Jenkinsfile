pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '681293277785'

        BACKEND_REPO = '681293277785.dkr.ecr.ap-south-1.amazonaws.com/cinemify-backend'
        FRONTEND_REPO = '681293277785.dkr.ecr.ap-south-1.amazonaws.com/cinemify-frontend'

        EKS_CLUSTER = 'cinemify-prod'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare') {
            steps {
                script {
                    env.GIT_SHA = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                }

                sh '''
                    echo "Deploying commit: ${GIT_SHA}"

                    aws sts get-caller-identity

                    aws eks update-kubeconfig \
                      --region ${AWS_REGION} \
                      --name ${EKS_CLUSTER}

                    kubectl get nodes
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password \
                      --region ${AWS_REGION} \
                    | docker login \
                      --username AWS \
                      --password-stdin \
                      ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                    docker build \
                      -t ${BACKEND_REPO}:${GIT_SHA} \
                      -t ${BACKEND_REPO}:latest \
                      ./backend
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    docker build \
                      --build-arg VITE_API_URL=/api \
                      -t ${FRONTEND_REPO}:${GIT_SHA} \
                      -t ${FRONTEND_REPO}:latest \
                      ./frontend
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    docker push ${BACKEND_REPO}:${GIT_SHA}
                    docker push ${BACKEND_REPO}:latest

                    docker push ${FRONTEND_REPO}:${GIT_SHA}
                    docker push ${FRONTEND_REPO}:latest
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                    kubectl set image deployment/backend \
                      backend=${BACKEND_REPO}:${GIT_SHA}

                    kubectl set image deployment/frontend \
                      frontend=${FRONTEND_REPO}:${GIT_SHA}
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl rollout status deployment/backend \
                      --timeout=180s

                    kubectl rollout status deployment/frontend \
                      --timeout=180s

                    kubectl get pods
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment successful: ${GIT_SHA}"
        }

        failure {
            echo "Deployment failed. Check Jenkins console output."
        }

        always {
            sh '''
                docker image prune -f || true
            '''
        }
    }
}