package com.example.entity.mongodb;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "mail_templates")
public class MailTemplate extends PanacheMongoEntityBase {

    public ObjectId id;

    public String type;         // CONFIRMATION, REMINDER, CANCELLATION

    public String subject;      // Tiêu đề mail

    public String contentHtml;  // Nội dung HTML, chứa {{fullName}}, v.v.
}