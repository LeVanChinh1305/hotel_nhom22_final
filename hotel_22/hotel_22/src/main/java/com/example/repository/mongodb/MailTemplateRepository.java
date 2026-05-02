package com.example.repository.mongodb;

import com.example.entity.mongodb.MailTemplate;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class MailTemplateRepository implements PanacheMongoRepository<MailTemplate> {
    public Optional<MailTemplate> findByType(String type) {
        return find("type", type).firstResultOptional();
    }
}