pipeline {
    agent any

environment {

        AWS_DOCKER_REGISTRY = '701518155081.dkr.ecr.eu-north-1.amazonaws.com'
        // your ECR repository name
        APP_NAME = 'imagefinalproject_ec'
        AWS_DEFAULT_REGION = 'eu-north-1'
    }

    stages {
        stage('Build') {
            agent{
                docker {
                    image 'node:20.15.1-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la 
                    node --version
                    npm --version
                    npm install
                    npm run build
                    ls -la 
                '''
            }
        }
        stage('Test') {
            agent{
                docker{
                    image 'node:20.15.1-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    test -f build/index.html
                    npm test
                '''
            }
        }
        stage('Build My Docker Image'){

            agent{
                docker{
                    image 'amazon/aws-cli'
                    reuseNode true
                    args '-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=""'
                }
            }
            steps{
                withCredentials([usernamePassword(credentialsId: 'finalprojectNewUserKey', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    
                    sh '''
                        amazon-linux-extras install docker
                        docker build -t $AWS_DOCKER_REGISTRY/$APP_NAME .
                        aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_DOCKER_REGISTRY
                        docker push $AWS_DOCKER_REGISTRY/$APP_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy to AWS'){
            agent{
                docker{
                    image 'amazon/aws-cli'
                    reuseNode true
                    // login as root, so that we could install jq
                    args '-u root --entrypoint=""'
                }
            }

            steps{
                withCredentials([usernamePassword(credentialsId: 'finalprojectNewUserKey', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    // some block
                    sh '''
                        aws --version
                        yum install jq -y
                        LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition.json | jq '.taskDefinition.revision')
                        aws ecs update-service --cluster my-new-react-app-Cluster-Prod --service my-new-react-app-Service-Prod --task-definition Group-Project-CE-Prod:$LATEST_TD_REVISION
                    '''
                }
            }
        }
    }
}