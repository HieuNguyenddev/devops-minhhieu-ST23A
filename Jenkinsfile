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
        
        // Token và ID người nhận tin nhắn riêng (DM) qua X (Twitter)
        X_BEARER_TOKEN = credentials('X_BEARER_TOKEN')
        X_RECIPIENT_ID = credentials('X_RECIPIENT_ID')
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
            // 📩 Gửi tin nhắn riêng (DM) qua X (Twitter) khi Deploy THÀNH CÔNG
            sh '''
                if [ -n "$X_BEARER_TOKEN" ] && [ -n "$X_RECIPIENT_ID" ]; then
                    curl -X POST "https://api.twitter.com/2/dm_conversations/with/$X_RECIPIENT_ID/messages" \
                        -H "Authorization: Bearer $X_BEARER_TOKEN" \
                        -H "Content-Type: application/json" \
                        -d '{"message": {"text": "🎉 [Jenkins] Deploy dự án Next.js lên Vercel THÀNH CÔNG!"}}'
                fi
            '''
        }
        failure {
            echo 'Deployment failed!'
            // 📩 Gửi tin nhắn riêng (DM) qua X (Twitter) khi Deploy THẤT BẠI
            sh '''
                if [ -n "$X_BEARER_TOKEN" ] && [ -n "$X_RECIPIENT_ID" ]; then
                    curl -X POST "https://api.twitter.com/2/dm_conversations/with/$X_RECIPIENT_ID/messages" \
                        -H "Authorization: Bearer $X_BEARER_TOKEN" \
                        -H "Content-Type: application/json" \
                        -d '{"message": {"text": "❌ [Jenkins] Deploy dự án Next.js lên Vercel THẤT BẠI!"}}'
                fi
            '''
        }
    }
}
