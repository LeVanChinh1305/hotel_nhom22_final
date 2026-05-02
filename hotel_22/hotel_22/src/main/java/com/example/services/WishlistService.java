package com.example.services;

import com.example.entity.mongodb.Wishlist;
import com.example.entity.mysql.User;
import com.example.exceptions.AppException;
import com.example.repository.mongodb.RoomRepository;
import com.example.repository.mongodb.WishlistRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class WishlistService {

    @Inject WishlistRepository wishlistRepository;
    @Inject RoomRepository     roomRepository;

    public List<String> getWishlist(User currentUser) {
        return wishlistRepository.findByUserId(currentUser.id)
                .map(w -> w.roomIds)
                .orElse(List.of());
    }

    public List<String> addRoom(User currentUser, String roomId) {
        // Kiểm tra phòng tồn tại
        validateRoomExists(roomId);

        Wishlist wishlist = getOrCreateWishlist(currentUser.id);

        if (wishlist.roomIds.contains(roomId))
            throw new AppException("Phòng đã có trong danh sách yêu thích", 409);

        wishlist.roomIds.add(roomId);
        wishlistRepository.persistOrUpdate(wishlist);
        return wishlist.roomIds;
    }

    public List<String> removeRoom(User currentUser, String roomId) {
        Wishlist wishlist = wishlistRepository.findByUserId(currentUser.id)
                .orElseThrow(() -> new AppException("Danh sách yêu thích đang trống", 404));

        if (!wishlist.roomIds.contains(roomId))
            throw new AppException("Phòng không có trong danh sách yêu thích", 404);

        wishlist.roomIds.remove(roomId);
        wishlistRepository.persistOrUpdate(wishlist);
        return wishlist.roomIds;
    }

    public void clearWishlist(User currentUser) {
        wishlistRepository.findByUserId(currentUser.id).ifPresent(w -> {
            w.roomIds.clear();
            wishlistRepository.persistOrUpdate(w);
        });
    }

    // ─── helpers ────────────────────────────────────────────────────────────

    private void validateRoomExists(String roomId) {
        try {
            roomRepository.findByIdOptional(new ObjectId(roomId))
                    .orElseThrow(() -> new AppException("Phòng không tồn tại", 404));
        } catch (IllegalArgumentException e) {
            throw new AppException("ID phòng không hợp lệ", 400);
        }
    }

    private Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            Wishlist w = new Wishlist();
            w.userId  = userId;
            w.roomIds = new ArrayList<>();
            return w;
        });
    }
}