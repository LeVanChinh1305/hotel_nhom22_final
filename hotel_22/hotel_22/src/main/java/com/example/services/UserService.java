package com.example.services;

import com.example.dto.request.CreateUserRequest;
import com.example.dto.response.UserResponse;
import com.example.entity.mysql.User;
import com.example.exceptions.AppException;
import com.example.mapper.UserMapper;
import com.example.repository.mysql.UserRepository;
import com.example.utils.ValidationUtils;
import io.quarkus.elytron.security.common.BcryptUtil;
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

        user.status = !user.status;
        userRepository.persist(user);

        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest req) {
        // Validate basic
        if (req.email == null || req.password == null || req.fullName == null)
            throw new AppException("Vui lòng điền đầy đủ thông tin bắt buộc", 400);
        
        ValidationUtils.validateEmail(req.email);
        
        if (userRepository.existsByEmail(req.email))
            throw new AppException("Email đã được sử dụng", 409);

        User user = new User();
        user.username = req.username != null ? req.username : req.email; // Fallback to email if username missing
        user.fullName = req.fullName;
        user.email = req.email;
        user.password = BcryptUtil.bcryptHash(req.password);
        user.phone = req.phone != null ? req.phone : ""; // Ensure not null
        user.status = true;
        
        try {
            user.role = User.Role.valueOf(req.role.toUpperCase());
        } catch (Exception e) {
            user.role = User.Role.CUSTOMER;
        }

        userRepository.persist(user);
        return userMapper.toResponse(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findByIdOptional(userId)
                .orElseThrow(() -> new AppException("Người dùng không tồn tại", 404));
        
        // Không cho phép xóa Admin (tùy chọn) hoặc ít nhất là không xóa chính mình
        // Ở đây cho phép xóa nếu không có ràng buộc khóa ngoại (booking...)
        userRepository.delete(user);
    }
}