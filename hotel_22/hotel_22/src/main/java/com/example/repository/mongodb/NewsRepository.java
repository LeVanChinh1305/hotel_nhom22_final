package com.example.repository.mongodb;

import com.example.entity.mongodb.News;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class NewsRepository implements PanacheMongoRepository<News> {
    public List<News> findPublished(String category) {
        if (category != null)
            return find("isPublished = true and category = ?1", category).list();
        return find("isPublished", true).list();
    }
    public Optional<News> findBySlug(String slug) {
        return find("slug", slug).firstResultOptional();
    }
}