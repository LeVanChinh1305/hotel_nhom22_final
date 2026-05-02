package com.example.services;

import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;

import com.example.dto.request.CreateRoomRequest;
import com.example.dto.response.RoomResponse;
import com.example.entity.mongodb.Room;
import com.example.exceptions.AppException;
import com.example.mapper.RoomMapper;
import com.example.repository.mongodb.RoomRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class RoomService {

    @Inject RoomRepository roomRepository;
    @Inject RoomMapper     roomMapper;

    public List<RoomResponse> searchRooms(String type, String address,
                                           Double minPrice, Double maxPrice,
                                           Integer maxOccupancy) {
        return roomRepository
                .search(type, address, minPrice, maxPrice, maxOccupancy)
                .stream()
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