
pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npx eslint .'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'

                    withSonarQubeEnv('SonarQube') {
                        sh """
                            "${scannerHome}/bin/sonar-scanner" \
                            -Dsonar.projectKey=SIT753-7.3HD-DevOps \
                            -Dsonar.projectName=SIT753-7.3HD-DevOps \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=node_modules/**,coverage/**,public/**/*.html \
                            -Dsonar.tests=test \
                            -Dsonar.test.inclusions=test/**/*.js
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Security') {
            steps {
                sh 'npm audit --audit-level=high'
            }
        }

       stage('Test') {
    steps {
        withEnv(['MONGODB_URI=mongodb://127.0.0.1:27017/sit753-devops-jenkins-test']) {
            sh 'npm test'
          }
         }
        }

        stage('Docker Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
                sh 'docker compose ps'
            }
        }

        stage('Release') {
            steps {
                sh 'docker image tag sit753-73hd-devops-app:latest sit753-73hd-devops-app:build-${BUILD_NUMBER}'
                sh 'docker image ls sit753-73hd-devops-app'
            }
        }

        stage('Monitoring') {
            steps {
                sh 'sleep 5'
                sh 'curl --fail http://localhost:3000/api/student'
                sh 'docker compose ps'
            }
        }
    }
}
