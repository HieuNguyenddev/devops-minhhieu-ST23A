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

        // Credentials cho Telegram Chatbot (Tùy chọn)
        TELEGRAM_BOT_TOKEN = credentials('TELEGRAM_BOT_TOKEN')
        TELEGRAM_CHAT_ID = credentials('TELEGRAM_CHAT_ID')

        // OAuth 2.0 Credentials từ X (Twitter) Developer Portal (Tùy chọn)
        X_CLIENT_ID = credentials('X_CLIENT_ID')
        X_CLIENT_SECRET = credentials('X_CLIENT_SECRET')
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

            // 🤖 1. Telegram Chatbot (Gửi tức thì 100% thành công)
            sh '''
                if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
                    MSG="🚀 *[JENKINS CI/CD REPORT]*%0A%0A🟢 *Trạng thái:* THÀNH CÔNG (SUCCESS)%0A📌 *Dự án:* Next.js App%0A🌿 *Nhánh:* main%0A🌐 *Vercel URL:* https://devops-minhhieu-st-23-a.vercel.app"
                    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
                        -d "chat_id=${TELEGRAM_CHAT_ID}" \
                        -d "text=${MSG}" \
                        -d "parse_mode=Markdown" || true
                fi
            '''
            
            // 🤖 2. Chatbot X (Twitter) Direct Message
            sh '''
                if [ -n "$X_CLIENT_ID" ] && [ -n "$X_CLIENT_SECRET" ] && [ -n "$X_RECIPIENT_ID" ]; then
                    TOKEN_RES=$(curl -s -u "$X_CLIENT_ID:$X_CLIENT_SECRET" \
                        -X POST "https://api.twitter.com/2/oauth2/token" \
                        -d "grant_type=client_credentials" || echo "")
                    ACCESS_TOKEN=$(echo "$TOKEN_RES" | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$' || echo "")
                    
                    MSG="🚀 [JENKINS CI/CD REPORT]\\n\\n🟢 Trạng thái: THÀNH CÔNG (SUCCESS)\\n📌 Dự án: Next.js App\\n🌿 Nhánh: main\\n🌐 Vercel URL: https://devops-minhhieu-st-23-a.vercel.app"
                    curl -s -X POST "https://api.twitter.com/2/dm_conversations/with/$X_RECIPIENT_ID/messages" \
                        -H "Authorization: Bearer $ACCESS_TOKEN" \
                        -H "Content-Type: application/json" \
                        -d "{\"message\": {\"text\": \"$MSG\"}}" || true
                fi
            '''
        }
        failure {
            echo 'Deployment failed!'

            // 🤖 1. Telegram Chatbot khi thất bại
            sh '''
                if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
                    MSG="❌ *[JENKINS CI/CD REPORT]*%0A%0A🔴 *Trạng thái:* THẤT BẠI (FAILURE)%0A📌 *Dự án:* Next.js App"
                    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
                        -d "chat_id=${TELEGRAM_CHAT_ID}" \
                        -d "text=${MSG}" \
                        -d "parse_mode=Markdown" || true
                fi
            '''
        }
    }
}
