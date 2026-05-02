package com.example.repository.mongodb;

import com.example.entity.mongodb.RoomStatusLog;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class RoomStatusLogRepository implements PanacheMongoRepository<RoomStatusLog> {
    public List<RoomStatusLog> findByRoomId(String roomId) {
        return find("roomId", roomId).list();
    }
}