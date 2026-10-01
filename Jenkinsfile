pipeline {
    agent any

    tools {
        // Yêu cầu đã cài đặt NodeJS plugin trên Jenkins và đặt tên tool là 'NodeJS' (Node.js LTS)
        nodejs 'NodeJS'
    }

    environment {
        // Cấu hình Credentials ID trên Jenkins tên là 'VERCEL_TOKEN' (Secret text)
        VERCEL_TOKEN = credentials('VERCEL_TOKEN')
        VERCEL_ORG_ID = credentials('VERCEL_ORG_ID')
        VERCEL_PROJECT_ID = credentials('VERCEL_PROJECT_ID')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/HieuNguyenddev/devops-minhhieu-ST23A.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint & Code Quality') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build Check') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Vercel') {
            steps {
                // Deploy lên Vercel Production sử dụng Vercel CLI
                sh '''
                    npx vercel pull --yes --environment=production --token=$VERCEL_TOKEN
                    npx vercel build --prod --token=$VERCEL_TOKEN
                    npx vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
