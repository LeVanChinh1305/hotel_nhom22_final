# Hotel 22 - Frontend UI

Thư mục này chứa mã nguồn giao diện người dùng (Frontend) cho hệ thống quản lý khách sạn Hotel 22. Dự án được xây dựng bằng **React** và công cụ build **Vite**.

## 🚀 Công nghệ sử dụng

- **React 19**: Thư viện UI chính.
- **Vite**: Công cụ build cực nhanh.
- **Lucide React**: Bộ icon hiện đại.
- **React Router Dom**: Quản lý điều hướng trang.
- **Vanilla CSS**: Thiết kế giao diện cao cấp (Premium Design).

## 🛠 Hướng dẫn cài đặt và chạy ứng dụng

Để khởi động dự án này trên máy cục bộ, bạn cần cài đặt **Node.js**.

### 1. Di chuyển vào thư mục dự án
Mở terminal và di chuyển đến thư mục frontend:
```bash
cd hotel_ui/hotel-frontend
```

### 2. Cài đặt các thư viện phụ thuộc (Dependencies)
Chạy lệnh sau để cài đặt tất cả các package cần thiết:
```bash
npm install
```

### 3. Chạy ứng dụng ở chế độ phát triển (Development Mode)
Khởi động dev server:
```bash
npm run dev
```
Sau khi chạy xong, terminal sẽ hiển thị địa chỉ local (thường là `http://localhost:5173`). Bạn hãy mở trình duyệt và truy cập địa chỉ này.

### 4. Xây dựng bản sản xuất (Production Build)
Để build ứng dụng cho việc triển khai thực tế:
```bash
npm run build
```

## 📂 Cấu trúc thư mục chính

- `src/pages/`: Chứa các trang chính của ứng dụng (Home, Rooms, Services, Admin, BookingHistory,...).
- `src/components/`: Chứa các thành phần giao diện dùng chung (Navbar, Footer, Modals,...).
- `src/assets/`: Chứa hình ảnh, icon và các tệp tĩnh.

## 📝 Lưu ý quan trọng
- Đảm bảo Backend (Quarkus) đang chạy tại `http://localhost:8080` để Frontend có thể gọi API.
- Nếu gặp lỗi về cổng (Port), bạn có thể cấu hình lại trong tệp `vite.config.js`.

---
*Phát triển bởi Hotel 22 Team*
