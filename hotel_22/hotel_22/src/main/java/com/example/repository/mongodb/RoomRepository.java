package com.example.repository.mongodb;

import com.example.entity.mongodb.Room;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class RoomRepository implements PanacheMongoRepository<Room> {

    public List<Room> search(String type, String address, Double minPrice,
                              Double maxPrice, Integer maxOccupancy) {
        StringBuilder query = new StringBuilder();
        java.util.Map<String, Object> params = new java.util.LinkedHashMap<>();

        if (type != null) { query.append("type = :type and "); params.put("type", type); }
        if (address != null) { query.append("address like :address and "); params.put("address", "%" + address + "%"); }
        if (minPrice != null) { query.append("basePrice >= :minPrice and "); params.put("minPrice", minPrice); }
        if (maxPrice != null) { query.append("basePrice <= :maxPrice and "); params.put("maxPrice", maxPrice); }
        if (maxOccupancy != null) { query.append("maxOccupancy >= :occ and "); params.put("occ", maxOccupancy); }

        String q = query.length() > 0
                ? query.substring(0, query.length() - 5)
                : "{}";
        return q.equals("{}")
                ? listAll()
                : find(q, params).list();
    }
}