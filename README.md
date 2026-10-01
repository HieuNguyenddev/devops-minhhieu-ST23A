# Hướng Dẫn Cấu Hình CI/CD Với GitHub Actions, Jenkins và Deploy Lên Vercel

Dự án Next.js kết hợp quy trình tích hợp và triển khai tự động (CI/CD) thông qua **GitHub Actions** và **Jenkins** lên hạ tầng **Vercel Cloud**.

---

## 📋 Mục Lục
1. [Chuẩn bị thông tin Vercel (Tokens & IDs)](#1-chuẩn-bị-thông-tin-vercel-tokens--ids)
2. [Cấu hình GitHub Actions CI/CD](#2-cấu-hình-github-actions-cicd)
3. [Cấu hình Jenkins Pipeline CI/CD](#3-cấu-hình-jenkins-pipeline-cicd)
4. [Kiểm tra và vận hành quy trình CI/CD](#4-kiểm-tra-và-vận-hành-quy-trình-cicd)

---

## 1. Chuẩn bị thông tin Vercel (Tokens & IDs)

Để kết nối CI/CD (GitHub Actions / Jenkins) tới Vercel, bạn cần lấy 3 thông số sau:

### Lấy `VERCEL_TOKEN`
1. Đăng nhập vào [Vercel Dashboard](https://vercel.com).
2. Vào **Account Settings** -> **Tokens**.
3. Bấm **Create Token**, nhập tên (ví dụ: `CI-CD-Token`), chọn scope thích hợp và nhấn **Create**.
4. Sao chép chuỗi Token vừa tạo.

---

## 2. Cấu hình GitHub Actions CI/CD

Pipeline GitHub Actions đã được định nghĩa tại file: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

### Cấu hình Secrets trên GitHub Repository:
1. Truy cập vào GitHub Repository của bạn trên trình duyệt.
2. Vào tab **Settings** -> **Secrets and variables** -> **Actions**.
3. Chọn **New repository secret** và thêm lần lượt 3 biến sau:
   - `VERCEL_TOKEN`: Nhập Token vừa tạo ở Bước 1.
   - `VERCEL_ORG_ID`: Nhập `orgId` thu được từ `.vercel/project.json`.
   - `VERCEL_PROJECT_ID`: Nhập `projectId` thu được từ `.vercel/project.json`.

### Quy trình hoạt động của GitHub Actions:
- Tự động kích hoạt khi có lệnh `push` hoặc `pull_request` vào nhánh `main`.
- Thực hiện kiểm tra source code: `npm ci`, `npm run lint`, `npm run build`.
- Tiến hành deploy lên môi trường Production của Vercel thông qua Vercel CLI.

---

## 3. Cấu hình Jenkins Pipeline CI/CD

Pipeline Jenkins đã được định nghĩa tại file: [`Jenkinsfile`](Jenkinsfile)

### Bước 1: Thêm Credentials trên Jenkins Server
1. Đăng nhập vào giao diện điều khiển **Jenkins**.
2. Đến **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials (unrestricted)**.
3. Bấm **Add Credentials** để tạo 3 Credentials kiểu **Secret text**:
   - Secret 1:
     - **Kind**: `Secret text`
     - **Secret**: *(Paste giá trị VERCEL_TOKEN)*
     - **ID**: `VERCEL_TOKEN`
   - Secret 2:
     - **Kind**: `Secret text`
     - **Secret**: *(Paste giá trị VERCEL_ORG_ID)*
     - **ID**: `VERCEL_ORG_ID`
   - Secret 3:
     - **Kind**: `Secret text`
     - **Secret**: *(Paste giá trị VERCEL_PROJECT_ID)*
     - **ID**: `VERCEL_PROJECT_ID`

### Bước 2: Cài đặt NodeJS Plugin trên Jenkins
1. Vào **Manage Jenkins** -> **Plugins** -> **Available plugins**.
2. Tìm và cài đặt plugin **NodeJS Plugin**.
3. Sau khi cài đặt, vào **Manage Jenkins** -> **Global Tool Configuration** -> **NodeJS**.
4. Chọn **Add NodeJS**, đặt tên là **`NodeJS`** (trùng tên cấu hình trong `Jenkinsfile`), chọn phiên bản Node.js (ví dụ NodeJS 20.x LTS) và nhấn **Save**.

### Bước 3: Tạo Pipeline Job trên Jenkins
1. Tại Jenkins Dashboard, chọn **New Item**.
2. Nhập tên Job (ví dụ: `my-nextjs-app`), chọn **Pipeline** và nhấn **OK**.
3. Ở mục **Build Triggers**, tick chọn **GitHub hook trigger for GITScm polling** (để Jenkins tự động build khi push code).
4. Ở mục **Pipeline**:
   - **Definition**: Chọn `Pipeline script from SCM`.
   - **SCM**: Chọn `Git`.
   - **Repository URL**: `https://github.com/HieuNguyenddev/devops-minhhieu-ST23A.git`
   - **Branch Specifier**: `*/main`
   - **Script Path**: `Jenkinsfile`
5. Nhấn **Save**.

---

## 4. Kiểm tra và vận hành quy trình CI/CD

Bất kỳ khi nào bạn thực hiện commit và push code mới lên nhánh `main`:

```bash
git add .
git commit -m "Cập nhật tính năng mới"
git push origin main
```

1. **GitHub Actions**: Sẽ tự động chạy workflow trong tab **Actions** trên GitHub và triển khai lên Vercel.
2. **Jenkins**: Sẽ kích hoạt pipeline từ `Jenkinsfile`, thực thi các bước `Checkout` -> `Install Dependencies` -> `Lint & Code Quality` -> `Build Check` -> `Deploy to Vercel`.
