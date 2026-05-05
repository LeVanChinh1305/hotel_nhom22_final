package com.example.security;

import com.example.entity.mysql.User;
import com.example.exceptions.AppException;
import com.example.repository.mysql.UserRepository;
import jakarta.enterprise.context.RequestScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;

@RequestScoped
public class CurrentUserProducer {

    @Inject
    JsonWebToken jwt;

    @Inject
    UserRepository userRepository;

    @Produces
    @RequestScoped
    public User getCurrentUser() {
        String email = jwt.getClaim("upn");
        if (email == null || email.isBlank()) {
            email = jwt.getName(); // fallback
        }
        if (email == null || email.isBlank()) {
            throw new AppException("JWT token không chứa thông tin email", 401);
        }

        final String finalEmail = email; // Make effectively final for lambda
        User user = userRepository.find("email", finalEmail)
                .firstResultOptional()
                .orElseThrow(() -> new AppException("Người dùng không tồn tại với email: " + finalEmail, 404));

        if (user.id == null) {
            throw new AppException("User ID không hợp lệ", 500);
        }

        return user;
    }
}