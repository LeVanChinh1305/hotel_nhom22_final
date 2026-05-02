package com.example.repository.mysql;

import com.example.entity.mysql.Booking;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class BookingRepository implements PanacheRepository<Booking> {

    public List<Booking> findByUserId(Long userId) {
        return find("user.id = ?1 ORDER BY createdAt DESC", userId).list();
    }

    /** Kiểm tra overbooking: phòng đã bị đặt trong khoảng thời gian chưa */
    public boolean isRoomBooked(String roomId, LocalDate checkIn, LocalDate checkOut) {
        return count("""
            roomId = ?1
            AND status NOT IN ('CANCELLED')
            AND checkInDate < ?3
            AND checkOutDate > ?2
        """, roomId, checkIn, checkOut) > 0;
    }

    /** Lấy các booking cần gửi mail nhắc nhở (check-in ngày mai, chưa gửi) */
    public List<Booking> findBookingsNeedingReminder(LocalDate tomorrow) {
        return find("checkInDate = ?1 AND isReminderMailSent = false AND status = 'CONFIRMED'",
                tomorrow).list();
    }

    /** Lấy các booking vừa tạo chưa gửi mail xác nhận */
    public List<Booking> findBookingsNeedingConfirmation() {
        return find("isConfirmedMailSent = false AND status = 'CONFIRMED'").list();
    }
}