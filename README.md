# Hệ Thống Quản Lý Khách Sạn - Hotel 22

Dự án này bao gồm hai phần chính: **Backend** (xây dựng bằng Quarkus Java) và **Frontend** (xây dựng bằng React Vite).

---

## 🛠 1. Hướng dẫn chạy Backend (Quarkus)

Backend chịu trách nhiệm xử lý logic nghiệp vụ, quản lý cơ sở dữ liệu và cung cấp API cho Frontend.

### Yêu cầu hệ thống:
- Java JDK 17 hoặc mới hơn.
- MySQL Server (để lưu trữ dữ liệu chính).
- MongoDB (để quản lý tình trạng phòng trống).

### Các bước thực hiện:
1. **Di chuyển vào thư mục backend**:
   ```bash
   cd hotel_22/hotel_22
   ```
2. **Cấu hình Database**:
   - Mở tệp `src/main/resources/application.properties`.
   - Cấu hình thông tin kết nối MySQL (`username`, `password`, `url`).
   - Cấu hình kết nối MongoDB.
3. **Khởi động Backend**:
   Chạy lệnh sau để khởi động ở chế độ phát triển:
   ```bash
   ./mvnw quarkus:dev
   ```
   Backend sẽ chạy tại địa chỉ: `http://localhost:8080`

---

## 🚀 2. Hướng dẫn chạy Frontend (React Vite)

Frontend cung cấp giao diện người dùng hiện đại và cao cấp.

### Yêu cầu hệ thống:
- Node.js (phiên bản mới nhất).

### Các bước thực hiện:
1. **Di chuyển vào thư mục frontend**:
   ```bash
   cd hotel_ui/hotel-frontend
   ```
2. **Cài đặt thư viện**:
   ```bash
   npm install
   ```
3. **Khởi động Frontend**:
   ```bash
   npm run dev
   ```
   Frontend sẽ chạy tại địa chỉ: `http://localhost:5173` (hoặc cổng khác hiển thị trên terminal).

---

## 📂 Cấu trúc dự án
- `/hotel_22/hotel_22`: Mã nguồn Java Quarkus (Backend).
- `/hotel_ui/hotel-frontend`: Mã nguồn React (Frontend).

## 📝 Lưu ý chung
- Cần khởi động Backend trước khi sử dụng Frontend để đảm bảo dữ liệu được tải chính xác.
- Đảm bảo các dịch vụ MySQL và MongoDB đã được bật.

---
*Phát triển bởi Hotel 22 Team*
