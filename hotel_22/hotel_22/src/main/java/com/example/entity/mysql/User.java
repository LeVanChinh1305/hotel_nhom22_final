package com.example.entity.mysql;

import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String username;

    @Column(nullable = false)
    public String password; // Bcrypt

    @Column(name = "full_name", nullable = false)
    public String fullName;

    @Column(nullable = false, unique = true)
    public String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Role role;

    @Column(length = 10, unique = true, nullable = false)
    public String phone;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Column(nullable = false)
    public Boolean status = true;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public enum Role {
        ADMIN, CUSTOMER
    }
}