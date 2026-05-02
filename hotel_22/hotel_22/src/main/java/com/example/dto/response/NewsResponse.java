package com.example.dto.response;

import com.example.entity.mongodb.News;
import java.time.LocalDateTime;

public class NewsResponse {
    public String id;
    public String title;
    public String slug;
    public String contentHtml;
    public String thumbnail;
    public String category;
    public Long authorId;
    public LocalDateTime createdAt;
    public Boolean isPublished;
}