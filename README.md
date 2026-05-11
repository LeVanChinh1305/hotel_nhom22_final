# Hệ Thống Quản Lý Khách Sạn - Hotel 22

Dự án này bao gồm hai phần chính: **Backend** (xây dựng bằng Quarkus Java) và **Frontend** (xây dựng bằng React Vite).

## 🌟 Tính năng nổi bật
- Quản lý đặt phòng, tìm kiếm phòng trống theo ngày.
- Giao diện người dùng sang trọng, responsive (chạy tốt trên cả điện thoại và máy tính).
- Quản lý Voucher, Tin tức, Dịch vụ khách sạn.
- Hệ thống Upload ảnh trực tiếp từ thiết bị ở trang Quản trị.
- Tự động tạo tài khoản Admin mặc định khi khởi động lần đầu.

---

## 🛠 1. Hướng dẫn cài đặt & chạy Backend (Quarkus)

Backend chịu trách nhiệm xử lý logic nghiệp vụ, lưu trữ dữ liệu và cung cấp API.

### Yêu cầu hệ thống:
- **Java JDK 17** hoặc mới hơn.
- **MySQL Server** (để lưu trữ dữ liệu người dùng, đặt phòng, dịch vụ,...).
- **MongoDB** (để quản lý dữ liệu linh hoạt cho phòng và tin tức).

### Các bước thực hiện:
1. **Di chuyển vào thư mục Backend**:
   Mở Terminal/Command Prompt và gõ:
   ```bash
   cd hotel_22/hotel_22
   ```

2. **Cấu hình Cơ sở dữ liệu (Database)**:
   - Tạo một Database MySQL trống (ví dụ: `hotel_db`).
   - Mở tệp cấu hình `src/main/resources/application.properties`.
   - Tìm và cập nhật thông tin kết nối MySQL của bạn:
     ```properties
     quarkus.datasource.db-kind=mysql
     quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/hotel_db
     quarkus.datasource.username=root
     quarkus.datasource.password=mat_khau_cua_ban
     ```
   - Cập nhật cấu hình kết nối MongoDB (nếu bạn có dùng mật khẩu cho MongoDB):
     ```properties
     quarkus.mongodb.connection-string=mongodb://localhost:27017
     quarkus.mongodb.database=hotel22_mongo
     ```

3. **Khởi động Backend**:
   Chạy lệnh sau để tải thư viện và khởi động (có thể mất vài phút cho lần chạy đầu tiên):
   ```bash
   ./mvnw quarkus:dev
   ```
   *Lưu ý: Ở lần chạy đầu tiên, Quarkus sẽ tự động tạo cấu trúc bảng trong MySQL. Nếu chưa có người dùng nào, hệ thống sẽ tự động tạo tài khoản Admin mặc định:*
   - **Tên đăng nhập**: `admin`
   - **Email**:`admin@hotel22.com`
   - **Mật khẩu**: `Admin@123`

   Backend sẽ chạy tại địa chỉ: `http://localhost:8080`

---

## 🚀 2. Hướng dẫn cài đặt & chạy Frontend (React Vite)

Frontend bao gồm trang web cho khách hàng và trang quản trị (Admin Dashboard).

### Yêu cầu hệ thống:
- **Node.js** (phiên bản 16.0 trở lên).

### Các bước thực hiện:
1. **Di chuyển vào thư mục Frontend**:
   Mở một cửa sổ Terminal mới (giữ nguyên Terminal của Backend) và gõ:
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
   Truy cập trang web tại địa chỉ: `http://localhost:5173`
   
   - *Để vào trang quản trị: Truy cập `/admin` hoặc bấm đăng nhập bằng tài khoản Admin mặc định ở trên.*

---

## 📂 Cấu trúc dự án & Lưu ý
- `/hotel_22/hotel_22`: Mã nguồn Java Quarkus (Backend). 
  - Toàn bộ ảnh bạn upload qua trang Quản trị sẽ được lưu cục bộ trong thư mục `resource/room_images` và `resource/new_images` tại đây.
- `/hotel_ui/hotel-frontend`: Mã nguồn React (Frontend).

### 📝 Lưu ý quan trọng:
- Đảm bảo bạn đã **bật (start) dịch vụ MySQL và MongoDB** trên máy tính trước khi chạy Backend.
- Luôn **chạy Backend trước** rồi mới chạy Frontend để trang web có thể gọi được API tải dữ liệu.

---
*Phát triển bởi Hotel 22 Team*
