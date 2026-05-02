package com.example.services;

import com.example.dto.request.UpdateRoomStatusRequest;
import com.example.entity.mongodb.RoomStatusLog;
import com.example.exceptions.AppException;
import com.example.repository.mongodb.RoomRepository;
import com.example.repository.mongodb.RoomStatusLogRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class RoomStatusLogService {

    private static final Set<String> VALID_STATUSES =
            Set.of("AVAILABLE", "OCCUPIED", "CLEANING", "MAINTENANCE");

    @Inject RoomStatusLogRepository repository;
    @Inject RoomRepository          roomRepository;

    public RoomStatusLog logStatus(UpdateRoomStatusRequest req, Long adminId) {
        // Validate
        if (req.roomId == null || req.roomId.isBlank())
            throw new AppException("Room ID không được để trống", 400);
        if (req.status == null || !VALID_STATUSES.contains(req.status.toUpperCase()))
            throw new AppException("Trạng thái không hợp lệ. Chỉ chấp nhận: " + VALID_STATUSES, 400);

        // Kiểm tra phòng tồn tại
        try {
            roomRepository.findByIdOptional(new ObjectId(req.roomId))
                    .orElseThrow(() -> new AppException("Phòng không tồn tại", 404));
        } catch (IllegalArgumentException e) {
            throw new AppException("ID phòng không hợp lệ", 400);
        }

        RoomStatusLog log = new RoomStatusLog();
        log.roomId    = req.roomId;
        log.status    = req.status.toUpperCase();
        log.updatedBy = adminId;
        log.updatedAt = LocalDateTime.now();
        repository.persist(log);

        return log;
    }

    public List<RoomStatusLog> getHistory(String roomId) {
        if (roomId == null || roomId.isBlank())
            throw new AppException("Room ID không được để trống", 400);
        return repository.findByRoomId(roomId);
    }

    /** Lấy trạng thái mới nhất của phòng */
    public String getLatestStatus(String roomId) {
        return repository.findByRoomId(roomId)
                .stream()
                .max((a, b) -> a.updatedAt.compareTo(b.updatedAt))
                .map(log -> log.status)
                .orElse("AVAILABLE");
    }
}