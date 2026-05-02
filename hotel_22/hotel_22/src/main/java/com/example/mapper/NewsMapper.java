package com.example.mapper;

import com.example.dto.request.CreateNewsRequest;
import com.example.dto.response.NewsResponse;
import com.example.entity.mongodb.News;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDateTime;

@ApplicationScoped
public class NewsMapper {

    public NewsResponse toResponse(News n) {
        if (n == null) return null;
        NewsResponse res = new NewsResponse();
        res.id          = n.id.toHexString();
        res.title       = n.title;
        res.slug        = n.slug;
        res.contentHtml = n.contentHtml;
        res.thumbnail   = n.thumbnail;
        res.category    = n.category;
        res.authorId    = n.authorId;
        res.createdAt   = n.createdAt;
        res.isPublished = n.isPublished;
        return res;
    }

    public News toEntity(CreateNewsRequest req, Long authorId) {
        News n = new News();
        n.title       = req.title;
        n.slug        = req.slug;
        n.contentHtml = req.contentHtml;
        n.thumbnail   = req.thumbnail;
        n.category    = req.category;
        n.authorId    = authorId;
        n.createdAt   = LocalDateTime.now();
        n.isPublished = req.isPublished;
        return n;
    }

    public void updateEntity(News n, CreateNewsRequest req) {
        n.title       = req.title;
        n.slug        = req.slug;
        n.contentHtml = req.contentHtml;
        n.thumbnail   = req.thumbnail;
        n.category    = req.category;
        n.isPublished = req.isPublished;
    }
}