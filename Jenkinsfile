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

        // Token Bot và ID người nhận tin nhắn riêng (DM) qua X (Twitter)
        X_BOT_TOKEN = credentials('X_BOT_TOKEN')
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
            
            // 🤖 Chatbot X (Twitter) Direct Message - Gửi tin nhắn private bằng Bot Token
            sh '''
                if [ -n "$X_BOT_TOKEN" ] && [ -n "$X_RECIPIENT_ID" ]; then
                    MSG="🚀 [JENKINS CI/CD REPORT]\\n\\n🟢 Trạng thái: THÀNH CÔNG (SUCCESS)\\n📌 Dự án: Next.js App\\n🌿 Nhánh: main\\n🌐 Vercel URL: https://devops-minhhieu-st-23-a.vercel.app\\n🐙 Repository: https://github.com/HieuNguyenddev/devops-minhhieu-ST23A"
                    curl -X POST "https://api.twitter.com/2/dm_conversations/with/$X_RECIPIENT_ID/messages" \
                        -H "Authorization: Bearer $X_BOT_TOKEN" \
                        -H "Content-Type: application/json" \
                        -d "{\"message\": {\"text\": \"$MSG\"}}"
                fi
            '''
        }
        failure {
            echo 'Deployment failed!'

            // 🤖 Chatbot X (Twitter) Direct Message - Gửi tin nhắn private bằng Bot Token
            sh '''
                if [ -n "$X_BOT_TOKEN" ] && [ -n "$X_RECIPIENT_ID" ]; then
                    MSG="❌ [JENKINS CI/CD REPORT]\\n\\n🔴 Trạng thái: THẤT BẠI (FAILURE)\\n📌 Dự án: Next.js App\\n🌿 Nhánh: main\\n🐙 Repository: https://github.com/HieuNguyenddev/devops-minhhieu-ST23A"
                    curl -X POST "https://api.twitter.com/2/dm_conversations/with/$X_RECIPIENT_ID/messages" \
                        -H "Authorization: Bearer $X_BOT_TOKEN" \
                        -H "Content-Type: application/json" \
                        -d "{\"message\": {\"text\": \"$MSG\"}}"
                fi
            '''
        }
    }
}
