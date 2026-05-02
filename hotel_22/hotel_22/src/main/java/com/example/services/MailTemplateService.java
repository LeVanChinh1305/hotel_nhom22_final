package com.example.services;

import com.example.dto.request.CreateMailTemplateRequest;
import com.example.entity.mongodb.MailTemplate;
import com.example.exceptions.AppException;
import com.example.repository.mongodb.MailTemplateRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class MailTemplateService {

    private static final Set<String> VALID_TYPES =
            Set.of("CONFIRMATION", "REMINDER", "CANCELLATION");

    @Inject MailTemplateRepository repository;

    public List<MailTemplate> getAll() {
        return repository.listAll();
    }

    public MailTemplate getById(String id) {
        return findByIdOrThrow(id);
    }

    public MailTemplate getByType(String type) {
        return repository.findByType(type.toUpperCase())
                .orElseThrow(() -> new AppException("Không tìm thấy template loại: " + type, 404));
    }

    public MailTemplate create(CreateMailTemplateRequest req) {
        validateRequest(req);

        if (repository.findByType(req.type).isPresent())
            throw new AppException("Template loại '" + req.type + "' đã tồn tại, hãy dùng chức năng cập nhật", 409);

        MailTemplate t = new MailTemplate();
        t.type        = req.type.toUpperCase();
        t.subject     = req.subject;
        t.contentHtml = req.contentHtml;
        repository.persist(t);
        return t;
    }

    public MailTemplate update(String id, CreateMailTemplateRequest req) {
        validateRequest(req);
        MailTemplate t = findByIdOrThrow(id);
        t.subject     = req.subject;
        t.contentHtml = req.contentHtml;
        repository.update(t);
        return t;
    }

    public void delete(String id) {
        MailTemplate t = findByIdOrThrow(id);
        repository.delete(t);
    }

    // ─── helpers ────────────────────────────────────────────────────────────

    private MailTemplate findByIdOrThrow(String id) {
        try {
            return repository.findByIdOptional(new ObjectId(id))
                    .orElseThrow(() -> new AppException("Mail template không tồn tại", 404));
        } catch (IllegalArgumentException e) {
            throw new AppException("ID template không hợp lệ", 400);
        }
    }

    private void validateRequest(CreateMailTemplateRequest req) {
        if (req.type == null || !VALID_TYPES.contains(req.type.toUpperCase()))
            throw new AppException("Loại template không hợp lệ. Chỉ chấp nhận: " + VALID_TYPES, 400);
        if (req.subject == null || req.subject.isBlank())
            throw new AppException("Tiêu đề mail không được để trống", 400);
        if (req.contentHtml == null || req.contentHtml.isBlank())
            throw new AppException("Nội dung mail không được để trống", 400);
    }
}