package com.example.entity.mongodb;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "news")
public class News extends PanacheMongoEntityBase {

    public ObjectId id; 

    public String title;

    public String slug;         // URL thân thiện

    public String contentHtml;  // Nội dung HTML từ Editor

    public String thumbnail;    // URL ảnh đại diện

    public String category;     // "Khuyến mãi", "Sự kiện", "Cẩm nang du lịch"

    public Long authorId;       // FK sang MySQL users.id (Admin)

    public LocalDateTime createdAt;

    public Boolean isPublished = false;
}