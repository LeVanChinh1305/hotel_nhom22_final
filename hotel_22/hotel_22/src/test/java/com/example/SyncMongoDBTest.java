package com.example;

import org.junit.jupiter.api.Test;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import com.example.entity.mysql.Booking;
import com.example.repository.mysql.BookingRepository;
import com.example.repository.mongodb.RoomAvailabilityRepository;
import java.util.List;

@QuarkusTest
public class SyncMongoDBTest {

    @Inject
    BookingRepository bookingRepository;

    @Inject
    RoomAvailabilityRepository roomAvailabilityRepository;

    @Test
    @Transactional
    public void synchronizeMySQLToMongoDB() {
        System.out.println(">>> BẮT ĐẦU ĐỒNG BỘ DỮ LIỆU TỪ MYSQL SANG MONGODB <<<");
        
        // 1. Xóa sạch dữ liệu cũ trong MongoDB room_availabilities để tránh trùng lặp
        System.out.println("1. Đang làm sạch MongoDB room_availabilities...");
        roomAvailabilityRepository.deleteAll();
        
        // 2. Lấy toàn bộ đơn đặt phòng từ MySQL
        List<Booking> bookings = bookingRepository.listAll();
        System.out.println("2. Đã đọc " + bookings.size() + " đơn đặt phòng từ MySQL.");
        
        // 3. Cập nhật lại lịch phòng trống dựa trên trạng thái của từng đơn đặt
        int count = 0;
        for (Booking booking : bookings) {
            String newStatus;
            switch (booking.status) {
                case CONFIRMED:
                case CHECKED_IN:
                case PENDING:
                    newStatus = "BOOKED";
                    break;
                case COMPLETED:
                case CANCELLED:
                default:
                    newStatus = "AVAILABLE";
                    break;
            }

            Long bookingId = (booking.status == Booking.BookingStatus.CONFIRMED 
                             || booking.status == Booking.BookingStatus.CHECKED_IN
                             || booking.status == Booking.BookingStatus.PENDING)
                    ? booking.id : null;
            
            System.out.println("   -> Đồng bộ đơn #" + booking.id + " (Phòng: " + booking.roomId + " | Trạng thái: " + booking.status + " -> Trạng thái phòng: " + newStatus + ")");
            roomAvailabilityRepository.updateRoomStatusRange(
                booking.roomId, 
                booking.checkInDate, 
                booking.checkOutDate, 
                newStatus, 
                bookingId
            );
            count++;
        }
        
        System.out.println(">>> ĐỒNG BỘ THÀNH CÔNG! Đã cập nhật xong " + count + " đơn đặt phòng vào MongoDB. <<<");
    }
}
// dùng để đồng bộ lại dữ liệu trong quá trình test ứng dụng
// ./mvnw test -Dtest=SyncMongoDBTest

