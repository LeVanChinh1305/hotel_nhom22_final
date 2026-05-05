package com.example.repository.mongodb;

import com.example.entity.mongodb.RoomAvailability;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class RoomAvailabilityRepository implements PanacheMongoRepository<RoomAvailability> {

    /** Kiểm tra phòng có trống trong khoảng ngày không */
    public boolean isRoomAvailable(String roomId, LocalDate checkIn, LocalDate checkOut) {
        // Lấy tất cả bản ghi trong khoảng ngày
        List<RoomAvailability> availabilities = find("roomId = ?1 AND date >= ?2 AND date < ?3",
                roomId, checkIn, checkOut).list();

        // Nếu không có bản ghi nào, nghĩa là trống (AVAILABLE mặc định)
        if (availabilities.isEmpty()) {
            return true;
        }

        // Nếu có bản ghi, kiểm tra tất cả phải là AVAILABLE
        return availabilities.stream().allMatch(ra -> "AVAILABLE".equals(ra.status));
    }

    /** Lấy trạng thái phòng theo ngày */
    public String getRoomStatus(String roomId, LocalDate date) {
        RoomAvailability ra = find("roomId = ?1 AND date = ?2", roomId, date).firstResult();
        return ra != null ? ra.status : "AVAILABLE";
    }

    /** Cập nhật trạng thái phòng cho một ngày */
    public void updateRoomStatus(String roomId, LocalDate date, String status, Long bookingId) {
        RoomAvailability ra = find("roomId = ?1 AND date = ?2", roomId, date).firstResult();
        if (ra == null) {
            ra = new RoomAvailability();
            ra.roomId = roomId;
            ra.date = date;
        }
        ra.status = status;
        ra.bookingId = bookingId;
        persistOrUpdate(ra);
    }

    /** Cập nhật trạng thái cho khoảng ngày */
    public void updateRoomStatusRange(String roomId, LocalDate checkIn, LocalDate checkOut, String status, Long bookingId) {
        LocalDate current = checkIn;
        while (!current.isAfter(checkOut.minusDays(1))) {
            updateRoomStatus(roomId, current, status, bookingId);
            current = current.plusDays(1);
        }
    }
}