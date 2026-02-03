# Quan Ly Thu Chi (Misa MoneyKeeper Clone)

Ứng dụng quản lý tài chính cá nhân toàn diện, được xây dựng với **React (Vite)** cho Frontend và **Laravel** cho Backend.

## 🚀 Tính Năng Nổi Bật

### 1. Quản Lý Tài Chính Cốt Lõi
*   **Ghi chép Thu/Chi**: Theo dõi thu nhập và chi tiêu hằng ngày.
*   **Phân loại Danh mục**: Tùy chỉnh danh mục chi tiêu đa cấp.
*   **Dashboard Trực Quan**: Biểu đồ thống kê dòng tiền, so sánh thu/chi theo tháng.

### 2. Quản Lý Tài Khoản Nâng Cao
*   **Đa Ví**: Quản lý nhiều nguồn tiền (Tiền mặt, Ngân hàng, Thẻ tín dụng).
*   **Chuyển Khoản**: Ghi nhận chuyển tiền giữa các ví (được xử lý thông minh để không làm lệch báo cáo tổng).
*   **Ngân Sách**: Thiết lập hạn mức chi tiêu cho từng danh mục để kiểm soát tài chính.

### 3. Tiện Ích Thông Minh
*   **Nhập Liệu Thông Minh (Smart Input)**: Gõ tự nhiên (ví dụ: *"Cafe 50k"*) -> Hệ thống tự động điền số tiền, danh mục.
*   **Sổ Nợ**: Quản lý các khoản vay và cho vay.
*   **Sổ Tiết Kiệm**: Theo dõi các khoản tích lũy.
*   **Sự Kiện/Chuyến Đi**: Gom nhóm chi tiêu cho các dịp đặc biệt (Du lịch, Đám cưới).

---

## 🛠️ Công Nghệ Sử Dụng

*   **Frontend**: ReactJS, TailwindCSS, Lucide Icons, Chart.js, Axios.
*   **Backend**: Laravel 10+, MySQL/SQLite.
*   **Authentication**: Laravel Sanctum (JWT/Bearer Token).

---

## 📦 Hướng Dẫn Cài Đặt (Local Development)

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
# Cấu hình DB_DATABASE trong .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Truy cập ứng dụng tại: `http://localhost:5173`

---

## 🚢 Hướng Dẫn Triển Khai (Deployment)

Dự án hỗ trợ 2 mô hình triển khai:
1.  **Tích hợp**: Build React vào Laravel Public (Dễ triển khai).
2.  **Tách biệt**: Chạy Backend (API) và Frontend riêng biệt (Chuyên nghiệp).

*Xem chi tiết tại thư mục `docs/deployment_guide.md`*

---

## 📸 Screenshots

![Dashboard](https://raw.githubusercontent.com/dangoctri/quan-li-chi-tieu/main/docs/dashboard.png)
*(Dashboard tổng quan với biểu đồ và KPI)*

---

**Developed by MinhMinh**
