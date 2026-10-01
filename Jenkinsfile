pipeline {
    agent any

    tools {
        // Yêu cầu đã cài đặt NodeJS plugin trên Jenkins và đặt tên tool là 'NodeJS' (Node.js LTS)
        nodejs 'NodeJS'
    }

    environment {
        // Cấu hình Credentials ID trên Jenkins
        VERCEL_TOKEN = credentials('VERCEL_TOKEN')
        VERCEL_ORG_ID = credentials('VERCEL_ORG_ID')
        VERCEL_PROJECT_ID = credentials('VERCEL_PROJECT_ID')
        
        // (Tùy chọn) Webhook Zalo / X Token nếu muốn nhận thông báo
        ZALO_WEBHOOK_URL = credentials('ZALO_WEBHOOK_URL') // Secret text
        X_BEARER_TOKEN = credentials('X_BEARER_TOKEN')     // Secret text cho X API
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
            // 🚀 Gửi thông báo đến Zalo Webhook
            sh '''
                if [ -n "$ZALO_WEBHOOK_URL" ]; then
                    curl -X POST "$ZALO_WEBHOOK_URL" \
                        -H "Content-Type: application/json" \
                        -d '{"text": "🎉 [Jenkins] Deploy dự án Next.js lên Vercel THÀNH CÔNG!"}'
                fi
            '''
            // 🚀 Gửi thông báo đăng bài lên X (Twitter) via API v2
            sh '''
                if [ -n "$X_BEARER_TOKEN" ]; then
                    curl -X POST "https://api.twitter.com/2/tweets" \
                        -H "Authorization: Bearer $X_BEARER_TOKEN" \
                        -H "Content-Type: application/json" \
                        -d '{"text": "🚀 [Jenkins CI/CD] Triển khai ứng dụng Next.js thành công lên Vercel!"}'
                fi
            '''
        }
        failure {
            echo 'Deployment failed!'
            sh '''
                if [ -n "$ZALO_WEBHOOK_URL" ]; then
                    curl -X POST "$ZALO_WEBHOOK_URL" \
                        -H "Content-Type: application/json" \
                        -d '{"text": "❌ [Jenkins] Deploy dự án Next.js lên Vercel THẤT BẠI!"}'
                fi
            '''
        }
    }
}
