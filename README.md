# 🚀 Hướng Dẫn Chi Tiết Cấu Hình CI/CD Với GitHub Actions, Jenkins và Triển Khai Lên Vercel

Tài liệu này hướng dẫn chi tiết từng bước (step-by-step) xây dựng quy trình tích hợp và triển khai liên tục (**CI/CD**) cho ứng dụng **Next.js** lên nền tảng **Vercel Cloud** thông qua hai công cụ **GitHub Actions** và **Jenkins**.

---

## 📐 1. Tổng Quan Kiến Trúc CI/CD

```
┌─────────────────┐       git push       ┌──────────────────┐
│   Developer     ├────────────────────►│  GitHub Repo     │
└─────────────────┘                      └────────┬─────────┘
                                                  │
                                 ┌────────────────┴────────────────┐
                                 ▼                                 ▼
                     ┌───────────────────────┐         ┌───────────────────────┐
                     │    GitHub Actions     │         │    Jenkins Server     │
                     │  (.github/workflows)  │         │     (Jenkinsfile)     │
                     └───────────┬───────────┘         └───────────┬───────────┘
                                 │                                 │
                                 │  Deploy via Vercel CLI / API    │
                                 └────────────────┬────────────────┘
                                                  ▼
                                       ┌─────────────────────┐
                                       │    Vercel Cloud     │
                                       │ (Production Deploy) │
                                       └─────────────────────┘
```

---

## 🔑 2. Bước 1: Chuẩn Bị Thông Tin Vercel (Token & IDs)

Để CI/CD (GitHub Actions hoặc Jenkins) có thể thay mặt bạn deploy ứng dụng lên Vercel, bạn cần lấy 3 thông số định danh chính:

### 2.1. Lấy Token Truy Cập Vercel (`VERCEL_TOKEN`)
1. Truy cập vào trang quản trị Vercel: [https://vercel.com](https://vercel.com) và đăng nhập account.
2. Click vào **Ảnh đại diện góc trên bên phải** ➔ chọn **Account Settings**.
3. Chọn menu **Tokens** ở cột bên trái.
4. Nhấn nút **Create Token**.
5. Đặt tên Token: ví dụ `cicd-deploy-token`.
6. Chọn Scope (mặc định là Full Access hoặc chọn đội nhóm của bạn).
7. Nhấn **Create** và **Sao chép mã Token này ngay lập tức** (Token chỉ hiển thị 1 lần duy nhất).

---

### 2.2. Lấy `VERCEL_ORG_ID` và `VERCEL_PROJECT_ID`
Cách nhanh và chính xác nhất để lấy 2 ID này là liên kết project thông qua **Vercel CLI** ngay trên máy tính của bạn:

1. Mở Terminal tại thư mục gốc của dự án (`my-project`).
2. Chạy lệnh đăng nhập Vercel:
   ```bash
   npx vercel login
   ```
   *(Nhấn Enter và làm theo hướng dẫn xác thực trên trình duyệt web)*.

3. Chạy lệnh liên kết project:
   ```bash
   npx vercel link
   ```
   - *Set up and deploy?* ➔ Gõ `y`
   - *Which scope do you want to deploy to?* ➔ Chọn Tài khoản/Org của bạn
   - *Link to existing project?* ➔ Gõ `n` (nếu đây là dự án mới) hoặc `y` (nếu đã có trên Vercel).
   - *What’s your project’s name?* ➔ Đặt tên project (ví dụ: `my-nextjs-app`).

4. Sau khi lệnh chạy hoàn tất, một thư mục ẩn tên là `.vercel` sẽ được tạo ra.
5. Mở file `.vercel/project.json` để lấy các giá trị:
   ```json
   {
     "orgId": "team_xxxxxxxxxxxxxxxxxxxx",
     "projectId": "prd_xxxxxxxxxxxxxxxxxxxx"
   }
   ```
   - **`VERCEL_ORG_ID`** = Giá trị của `orgId`
   - **`VERCEL_PROJECT_ID`** = Giá trị của `projectId`

---

## 🐙 3. Bước 2: Cấu Hình GitHub Actions CI/CD

### 3.1. Thêm Repository Secrets trên GitHub
1. Truy cập GitHub Repository dự án của bạn (ví dụ: `https://github.com/HieuNguyenddev/devops-minhhieu-ST23A`).
2. Nhấp vào tab **Settings** (ở phía trên cùng của Repo).
3. Ở cột menu trái, tìm mục **Secrets and variables** ➔ chọn **Actions**.
4. Nhấn nút **New repository secret** và lần lượt tạo **3 Secrets**:

| Name Secret | Value (Giá trị nhập vào) |
| :--- | :--- |
| `VERCEL_TOKEN` | Dán mã Token lấy từ mục 2.1 |
| `VERCEL_ORG_ID` | Dán giá trị `orgId` từ mục 2.2 |
| `VERCEL_PROJECT_ID` | Dán giá trị `projectId` từ mục 2.2 |

---

### 3.2. Cấu hình file Workflow `.github/workflows/deploy.yml`
File cấu hình đã được tạo sẵn tại đường dẫn [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**Chi tiết quy trình làm việc của file:**
1. **Trigger**: Tự động kích hoạt khi có sự kiện `push` hoặc `pull_request` lên nhánh `main`.
2. **Setup Node.js**: Cài đặt môi trường Node.js 20.
3. **Install & Test**: Chạy `npm ci`, `npm run lint`, `npm run build`.
4. **Pull Vercel Environment**: Tải thông tin môi trường Production từ Vercel.
5. **Build Artifacts**: Đóng gói dự án theo chuẩn Vercel CLI (`npx vercel build --prod`).
6. **Deploy**: Đẩy sản phẩm lên Vercel Production (`npx vercel deploy --prebuilt --prod`).

---

## 🏗️ 4. Bước 3: Cấu Hình Jenkins Pipeline CI/CD

### 4.0. Hướng Dẫn Khởi Chạy Và Đăng Nhập Jenkins (Chi Tiết Cho Người Mới)

#### A. Khởi chạy Jenkins Server (nếu chưa chạy)
Tùy vào môi trường cài đặt của bạn, chạy một trong các cách sau:

- **Cách 1: Chạy bằng Docker (Khuyên dùng)**
  ```bash
  docker run -d -p 8080:8080 -p 50000:50000 --name jenkins-server jenkins/jenkins:lts
  ```
- **Cách 2: Chạy bằng Homebrew (Trên macOS)**
  ```bash
  brew services start jenkins-lts
  ```
- **Cách 3: Chạy trực tiếp bằng file WAR**
  ```bash
  java -jar jenkins.war --httpPort=8080
  ```

---

#### B. Các bước đăng nhập & kích hoạt Jenkins lần đầu tiên

1. **Mở trình duyệt web**:
   - Truy cập vào địa chỉ: [http://localhost:8080](http://localhost:8080) *(Hoặc `http://<IP_MAY_CHU>:8080` nếu chạy trên Server từ xa)*.

2. **Màn hình "Unlock Jenkins" (Mở khóa Jenkins)**:
   - Jenkins sẽ yêu cầu nhập **Administrator password** để xác minh quyền sở hữu.
   - **Cách lấy mật khẩu này**:
     - *Nếu dùng Docker*:
       ```bash
       docker exec -it jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword
       ```
     - *Nếu cài trực tiếp trên macOS/Linux*:
       ```bash
       cat ~/.jenkins/secrets/initialAdminPassword
       # hoặc
       cat /var/lib/jenkins/secrets/initialAdminPassword
       ```
   - Sao chép đoạn chuỗi mật khẩu (gồm chữ và số) dán vào ô **Administrator password** ➔ Nhấn **Continue**.

3. **Màn hình "Customize Jenkins" (Cài đặt Plugin)**:
   - Chọn **Install suggested plugins** *(Giao diện sẽ tự động cài đặt các plugin phổ biến như Git, Pipeline, Credentials,...)*.
   - Chờ tiến trình cài đặt hoàn tất (khoảng 1 - 3 phút).

4. **Màn hình "Create First Admin User" (Tạo tài khoản quản trị)**:
   - Nhập thông tin tài khoản bạn muốn dùng đăng nhập sau này:
     - **Username**: (ví dụ: `admin` hoặc `minhhieu`)
     - **Password**: (nhập mật khẩu của bạn)
     - **Confirm Password**: (xác nhận lại mật khẩu)
     - **Full Name**: (ví dụ: `Minh Hieu`)
     - **E-mail address**: (nhập email của bạn)
   - Nhấn **Save and Continue**.

5. **Màn hình "Instance Configuration"**:
   - Giữ nguyên URL mặc định: `http://localhost:8080/` ➔ Nhấn **Save and Finish** ➔ Nhấn **Start using Jenkins**.

6. **Đăng nhập những lần sau**:
   - Truy cập [http://localhost:8080](http://localhost:8080) và nhập **Username** & **Password** vừa tạo ở **Bước 4**.

---

### 4.1. Thêm Credentials vào Jenkins
1. Đăng nhập vào giao diện quản trị **Jenkins Server**.
2. Chọn **Manage Jenkins** ➔ **Credentials** ➔ chọn miền **(global)**.
3. Bấm **+ Add Credentials** ở góc trái trên và thêm 3 bản ghi kiểu **Secret text**:

- **Bản ghi 1**:
  - Kind: `Secret text`
  - Secret: *(Paste giá trị VERCEL_TOKEN)*
  - ID: `VERCEL_TOKEN`
- **Bản ghi 2**:
  - Kind: `Secret text`
  - Secret: *(Paste giá trị VERCEL_ORG_ID)*
  - ID: `VERCEL_ORG_ID`
- **Bản ghi 3**:
  - Kind: `Secret text`
  - Secret: *(Paste giá trị VERCEL_PROJECT_ID)*
  - ID: `VERCEL_PROJECT_ID`

---

### 4.2. Cài Đặt và Cấu Hình Plugin NodeJS Trong Jenkins
1. Vào **Manage Jenkins** ➔ **Plugins** ➔ chuyển qua tab **Available plugins**.
2. Tìm kiếm từ khóa `NodeJS` ➔ Tích chọn **NodeJS Plugin** và chọn **Install**.
3. Sau khi cài thành công, vào **Manage Jenkins** ➔ **Global Tool Configuration** (hoặc *Tools*).
4. Tìm đến mục **NodeJS**:
   - Nhấn **Add NodeJS**.
   - **Name**: Nhập chính xác là `NodeJS` *(tên này phải khớp với từ khóa `nodejs 'NodeJS'` trong file Jenkinsfile)*.
   - **Version**: Chọn bản LTS (ví dụ `NodeJS 20.x`).
   - Nhấn **Save** để lưu lại.

---

### 4.3. Tạo và Cấu Hình Job Pipeline trên Jenkins
1. Từ giao diện chính Jenkins, chọn **New Item**.
2. Nhập tên Job (ví dụ: `NextJS-Vercel-Pipeline`), chọn kiểu **Pipeline** ➔ Nhấn **OK**.
3. Tại mục **Build Triggers**:
   - Tích chọn **GitHub hook trigger for GITScm polling** (để Jenkins tự động lắng nghe sự kiện push từ GitHub).
4. Tại mục **Pipeline**:
   - **Definition**: Chọn `Pipeline script from SCM`.
   - **SCM**: Chọn `Git`.
   - **Repository URL**: `https://github.com/HieuNguyenddev/devops-minhhieu-ST23A.git`
   - **Branches to build**: `*/main`
   - **Script Path**: `Jenkinsfile`
5. Nhấn **Save**.

---

### 4.4. Cấu Hình GitHub Webhook Đến Jenkins (Tùy chọn)

**`IP_JENKINS_CỦA_BẠN` là gì?**
Đó là Địa chỉ IP của máy tính hoặc Máy chủ Server đang khởi chạy phần mềm Jenkins.

#### 💡 Cách lấy Địa chỉ IP / URL để điền vào Payload URL:

- **Trường hợp 1: Chạy Jenkins trên Máy tính cá nhân (MacBook / PC)**
  - Do GitHub ở trên Cloud không thể truy cập trực tiếp vào `localhost` hay IP nội bộ (`192.168.x.x`) của máy tính bạn, bạn hãy tạo một đường dẫn kết nối Internet bằng công cụ **Ngrok**:
    ```bash
    npx ngrok http 8080
    ```
  - Ngrok sẽ sinh ra một liên kết Internet (Ví dụ: `https://a1b2-113-161-x-x.ngrok-free.app`).
  - Điền vào **Payload URL**: `https://a1b2-113-161-x-x.ngrok-free.app/github-webhook/`

- **Trường hợp 2: Chạy Jenkins trên Máy chủ Cloud (VPS / EC2 / DigitalOcean)**
  - Đó chính là **Public IP** của máy chủ đó.
  - Điền vào **Payload URL**: `http://<PUBLIC_IP_VPS>:8080/github-webhook/`

#### Các bước thêm Webhook trên GitHub:
1. Vào GitHub Repo ➔ **Settings** ➔ **Webhooks** ➔ **Add webhook**.
2. **Payload URL**: Nhập địa chỉ thu được ở trên (nhớ có đuôi `/github-webhook/`).
3. **Content type**: Chọn `application/json`.
4. Select events: Chọn `Just the push event`.
5. Nhấn **Add webhook**.

---

## 🤖 5. Hướng Dẫn Cấu Hình Telegram Chatbot Báo Cáo Kết Quả Deploy (Khuyên Dùng - Hoàn Toàn Miễn Phí)

Hệ thống CI/CD (cả **GitHub Actions** và **Jenkins**) được tích hợp Chatbot Telegram báo cáo chi tiết **TOÀN BỘ THÔNG TIN** đến điện thoại/máy tính của bạn ngay sau khi tiến trình Deploy hoàn tất:

### 📋 Mẫu tin nhắn Telegram Chatbot gửi về:
- 🟢 **Khi THÀNH CÔNG**:
  ```text
  🚀 [CI/CD DEPLOYMENT REPORT]

  🟢 Trạng thái: THÀNH CÔNG (SUCCESS)
  📌 Dự án: Next.js App
  🌿 Nhánh: main
  👤 Tác giả: HieuNguyenddev
  🌐 Vercel Live URL: https://devops-minhhieu-st-23-a.vercel.app
  🐙 Repository: https://github.com/HieuNguyenddev/devops-minhhieu-ST23A
  ```

---

### 🔑 Bước 1: Hướng Dẫn Chi Tiết Lấy `TELEGRAM_BOT_TOKEN` (Qua @BotFather)

1. **Mở ứng dụng Telegram**: Truy cập Telegram trên điện thoại, máy tính (Telegram Desktop) hoặc web ([web.telegram.org](https://web.telegram.org)).
2. **Tìm kiếm BotFather**:
   - Ở ô tìm kiếm (Search), nhập chính xác: **`@BotFather`**
   - Chọn đúng tài khoản **BotFather** có **tích xanh xác thực** (Verified Badge) từ Telegram.
3. **Khởi động nhắn tin với BotFather**:
   - Nhấn nút **Start** (hoặc gõ `/start`).
4. **Tạo Bot mới**:
   - Gửi lệnh: `/newbot`
5. **Đặt tên hiển thị cho Bot**:
   - BotFather sẽ hỏi: *"Alright, a new bot. How are we going to call it? Please choose a name for your bot."*
   - Bạn nhập tên bất kỳ (Ví dụ: `Minh Hieu DevOps Bot`).
6. **Đặt tên Username cho Bot**:
   - BotFather tiếp tục hỏi: *"Good. Now let's choose a username for your bot. It must end in `bot`..."*
   - Bạn nhập tên Username **duy nhất** bắt buộc kết thúc bằng từ `bot` (Ví dụ: `minhhieu_nextjs_deploy_bot`).
7. **Lấy Token**:
   - BotFather sẽ phản hồi tin nhắn chúc mừng kèm thông báo dạng:
     ```text
     Done! Congratulations on your new bot.
     ...
     Use this token to access the HTTP API:
     7123456789:AAFxXXXXX_xxxxxxxxxxxxxxxxxxxx
     ```
   - Sao chép (Copy) toàn bộ chuỗi ký tự nằm sau câu *"Use this token to access the HTTP API:"*.
   - ➔ Đây chính là mã **`TELEGRAM_BOT_TOKEN`** của bạn.

---

### 🔑 Bước 2: Lấy Chat ID Nhận Tin Nhắn

1. Mở Telegram, tìm kiếm bot **`@userinfobot`** và nhấn **Start**.
2. Bot sẽ lập tức gửi lại thông tin ID cá nhân của bạn (Ví dụ: `123456789`).
   👉 Đây chính là **`TELEGRAM_CHAT_ID`**.

---

### ⚙️ Bước 3: Cấu Hình Secrets Vào GitHub / Jenkins

- **Trên GitHub Actions** (*Settings ➔ Secrets and variables ➔ Actions*):
  - Nhấn **New repository secret**:
    - Secret 1: `TELEGRAM_BOT_TOKEN` = *(Paste token từ BotFather)*
    - Secret 2: `TELEGRAM_CHAT_ID` = *(Paste ID từ userinfobot)*

- **Trên Jenkins** (*Manage Jenkins ➔ Credentials ➔ Add Credentials*):
  - Thêm 2 Credentials (kiểu *Secret text*):
    - ID: `TELEGRAM_BOT_TOKEN`
    - ID: `TELEGRAM_CHAT_ID`

---

## 🧪 6. Kiểm Trả & Vận Hành Quy Trình (Testing)

Mỗi khi bạn hoàn thành một tính năng hoặc sửa lỗi, thực hiện lệnh đẩy code:

```bash
git add .
git commit -m "Thêm tính năng mới cho dự án"
git push origin main
```

### Kết quả mong đợi:
1. **Trên GitHub Actions**:
   - Vào tab **Actions** trên GitHub Repo. Bạn sẽ thấy Workflow `CI/CD Pipeline to Vercel` chạy thành công với dấu tích xanh ✅.
2. **Trên Jenkins**:
   - Jenkins sẽ nhận thông báo, tự động tạo lượt Build mới, lần lượt chạy qua các Stage trong file `Jenkinsfile` và hiển thị kết quả thành công ✅.
3. **Trên Vercel**:
   - Ứng dụng của bạn tại dashboard Vercel sẽ tự động cập nhật phiên bản mới nhất từ nhánh `main`.

---

## ❓ 6. Cấu Trúc Các File CI/CD Trong Dự Án

- 📄 [`Jenkinsfile`](Jenkinsfile): File cấu hình các stage cho Jenkins Server.
- 📄 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): File cấu hình workflow cho GitHub Actions.
- 📄 [`README.md`](README.md): Hướng dẫn sử dụng & vận hành dự án.

---

## 🛠️ 7. Khắc Phục Lỗi Thường Gặp (Troubleshooting)

1. **Lỗi `Invalid Vercel Token`**:
   - *Nguyên nhân*: Mã Token hết hạn hoặc nhập sai vế.
   - *Khắc phục*: Kiểm tra lại Secret `VERCEL_TOKEN` trên GitHub / Jenkins.

2. **Lỗi `Node.js tool NodeJS not found` trên Jenkins**:
   - *Nguyên nhân*: Chưa đặt tên Tool là `NodeJS` trong mục *Manage Jenkins ➔ Global Tool Configuration*.
   - *Khắc phục*: Đặt tên cấu hình NodeJS trùng khớp với chuỗi trong `Jenkinsfile`.

3. **Lỗi `Could not retrieve Project Settings`**:
   - *Nguyên nhân*: Sai `VERCEL_ORG_ID` hoặc `VERCEL_PROJECT_ID`.
   - *Khắc phục*: Kiểm tra lại giá trị trong `.vercel/project.json` và cập nhật lại Secrets.
