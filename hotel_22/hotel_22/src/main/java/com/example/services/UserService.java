package com.example.services;

import com.example.dto.response.UserResponse;
import com.example.entity.mysql.User;
import com.example.exceptions.AppException;
import com.example.mapper.UserMapper;
import com.example.repository.mysql.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class UserService {

    @Inject UserRepository userRepository;
    @Inject UserMapper     userMapper;

    public UserResponse getProfile(User currentUser) {
        return userMapper.toResponse(currentUser);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.listAll()
                .stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findByIdOptional(userId)
                .orElseThrow(() -> new AppException("Người dùng không tồn tại", 404));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findByIdOptional(userId)
                .orElseThrow(() -> new AppException("Người dùng không tồn tại", 404));

        // Không cho phép khóa chính mình
        // (check ở controller nếu cần truyền currentUser vào)
        user.status = !user.status;
        userRepository.persist(user);

        return userMapper.toResponse(user);
    }
}