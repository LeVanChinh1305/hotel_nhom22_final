package com.example.dto.response;

import java.time.LocalDateTime;

public class NewsResponse {
    public String id;
    public String title;
    public String thumbnail;
    public LocalDateTime createdAt;
    public LocalDateTime expiryDate;
}