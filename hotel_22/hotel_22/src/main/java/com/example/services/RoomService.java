package com.example.services;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;

import com.example.dto.request.CreateRoomRequest;
import com.example.dto.response.RoomResponse;
import com.example.entity.mongodb.Room;
import com.example.entity.mysql.Booking;
import com.example.exceptions.AppException;
import com.example.mapper.RoomMapper;
import com.example.repository.mongodb.RoomAvailabilityRepository;
import com.example.repository.mongodb.RoomRepository;
import com.example.repository.mysql.BookingRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class RoomService {

    @Inject RoomRepository roomRepository;
    @Inject RoomAvailabilityRepository roomAvailabilityRepository;
    @Inject RoomMapper     roomMapper;
    @Inject BookingRepository bookingRepository;

    public List<RoomResponse> searchRooms(String type, String address,
                                           Double minPrice, Double maxPrice,
                                           Integer maxOccupancy,
                                           LocalDate checkInDate, LocalDate checkOutDate) {
        List<Room> rooms = roomRepository
                .search(type, address, minPrice, maxPrice, maxOccupancy);

        if (checkInDate != null && checkOutDate != null) {
            rooms = rooms.stream()
                    .filter(room -> roomAvailabilityRepository.isRoomAvailable(
                            room.id.toString(), checkInDate, checkOutDate))
                    .collect(Collectors.toList());
        }

        return rooms.stream()
                .map(roomMapper::toResponse)
                .collect(Collectors.toList());
    }

    public RoomResponse getById(String id) {
        Room room = findRoomOrThrow(id);
        return roomMapper.toResponse(room);
    }

    public RoomResponse create(CreateRoomRequest req) {
        validateRoomRequest(req);

        // Kiểm tra trùng số phòng
        if (roomRepository.find("roomNumber", req.roomNumber).firstResultOptional().isPresent())
            throw new AppException("Số phòng '" + req.roomNumber + "' đã tồn tại", 409);

        Room room = roomMapper.toEntity(req);
        roomRepository.persist(room);
        return roomMapper.toResponse(room);
    }

    public RoomResponse update(String id, CreateRoomRequest req) {
        validateRoomRequest(req);
        Room room = findRoomOrThrow(id);

        // Nếu đổi số phòng -> kiểm tra xem số mới đã tồn tại ở phòng khác chưa
        if (!room.roomNumber.equals(req.roomNumber) &&
            roomRepository.find("roomNumber", req.roomNumber).firstResultOptional().isPresent())
            throw new AppException("Số phòng '" + req.roomNumber + "' đã tồn tại", 409);

        roomMapper.updateEntity(room, req);
        roomRepository.update(room);
        return roomMapper.toResponse(room);
    }

    public void delete(String id) {
        Room room = findRoomOrThrow(id);
        roomRepository.delete(room);
    }

    /**
     * Kiểm tra xem phòng có thể xoá hay không
     * Trả về thông tin về các booking active liên quan
     */
    public List<Booking> findActiveBookingsByRoom(String roomId) {
        LocalDate today = LocalDate.now();
        return bookingRepository.find(
            "roomId = ?1 AND status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN') AND checkOutDate >= ?2",
            roomId, today
        ).list();
    }

    /**
     * Set trạng thái maintenance cho một ngày cụ thể của phòng
     */
    public void setRoomMaintenance(String roomId, LocalDate date, String status) {
        // Kiểm tra phòng tồn tại
        findRoomOrThrow(roomId);

        // Validate status
        if (!"MAINTENANCE".equals(status)) {
            throw new AppException("Chỉ hỗ trợ trạng thái MAINTENANCE", 400);
        }

        // Validate date không được là quá khứ
        if (date.isBefore(LocalDate.now())) {
            throw new AppException("Không thể đặt bảo trì cho ngày trong quá khứ", 400);
        }

        // Kiểm tra không có booking active trong ngày đó
        List<Booking> conflictingBookings = bookingRepository.find(
            "roomId = ?1 AND status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN') AND ?2 BETWEEN checkInDate AND checkOutDate",
            roomId, date
        ).list();

        if (!conflictingBookings.isEmpty()) {
            throw new AppException("Không thể đặt bảo trì vì có booking active trong ngày này", 409);
        }

        // Set maintenance status trong room availability
        roomAvailabilityRepository.updateRoomStatusRange(
            roomId, date, date.plusDays(1), status, null
        );
    }

    // ─── helpers ────────────────────────────────────────────────────────────

    private Room findRoomOrThrow(String id) {
        try {
            return roomRepository.findByIdOptional(new ObjectId(id))
                    .orElseThrow(() -> new AppException("Phòng không tồn tại", 404));
        } catch (IllegalArgumentException e) {
            throw new AppException("ID phòng không hợp lệ", 400);
        }
    }

    private void validateRoomRequest(CreateRoomRequest req) {
        if (req.roomNumber == null || req.roomNumber.isBlank())
            throw new AppException("Số phòng không được để trống", 400);
        if (req.basePrice == null || req.basePrice <= 0)
            throw new AppException("Giá phòng phải lớn hơn 0", 400);
        if (req.maxOccupancy == null || req.maxOccupancy <= 0)
            throw new AppException("Sức chứa phải lớn hơn 0", 400);
    }
}