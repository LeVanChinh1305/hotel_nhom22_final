package com.example.mapper;

import com.example.dto.request.CreateServiceRequest;
import com.example.dto.response.ServiceResponse;
import com.example.entity.mongodb.Service;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ServiceMapper {

    public ServiceResponse toResponse(Service s) {
        if (s == null) return null;
        ServiceResponse res = new ServiceResponse();
        res.id          = s.id.toHexString();
        res.serviceName = s.serviceName;
        res.description = s.description;
        res.price       = s.price;
        res.unit        = s.unit;
        res.isAvailable = s.isAvailable;
        return res;
    }

    public Service toEntity(CreateServiceRequest req) {
        Service s = new Service();
        s.serviceName = req.serviceName;
        s.description = req.description;
        s.price       = req.price;
        s.unit        = req.unit;
        s.isAvailable = req.isAvailable;
        return s;
    }

    public void updateEntity(Service s, CreateServiceRequest req) {
        s.serviceName = req.serviceName;
        s.description = req.description;
        s.price       = req.price;
        s.unit        = req.unit;
        s.isAvailable = req.isAvailable;
    }
}