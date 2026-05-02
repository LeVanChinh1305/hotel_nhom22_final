package com.example.entity.mongodb;

import org.bson.types.ObjectId;

import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "services")
public class Service extends PanacheMongoEntityBase {

    public ObjectId id;

    public String serviceName;  // "Đưa đón sân bay", "Ăn sáng tại phòng"

    public String description;

    public Double price;

    public ServiceUnit unit;         // "Lượt", "Ngày", "Người"

    public Boolean isAvailable = true;

    public enum ServiceUnit {
        LUOT("Lượt"),
        NGAY("Ngày"),
        NGUOI("Người");

        public final String displayName;

        private ServiceUnit(String displayName) {
            this.displayName = displayName;
        }

        public static ServiceUnit fromString(String value) {
            for (ServiceUnit unit : ServiceUnit.values()) {
                if (unit.name().equalsIgnoreCase(value) || unit.displayName.equalsIgnoreCase(value)) {
                    return unit;
                }
            }
            return null;
        }
    }
}