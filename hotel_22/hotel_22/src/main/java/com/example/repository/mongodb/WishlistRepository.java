package com.example.repository.mongodb;

import com.example.entity.mongodb.Wishlist;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class WishlistRepository implements PanacheMongoRepository<Wishlist> {
    public Optional<Wishlist> findByUserId(Long userId) {
        return find("userId", userId).firstResultOptional();
    }
}