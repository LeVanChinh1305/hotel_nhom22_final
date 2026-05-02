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
        String email = jwt.getName();
        return userRepository.find("email", email)
                .firstResultOptional()
                .orElseThrow(() -> new AppException("User not found", 404));
    }
}