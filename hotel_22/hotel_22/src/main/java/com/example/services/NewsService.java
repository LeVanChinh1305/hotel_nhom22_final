package com.example.services;

import com.example.dto.request.CreateNewsRequest;
import com.example.dto.response.NewsResponse;
import com.example.entity.mongodb.News;
import com.example.entity.mysql.User;
import com.example.exceptions.AppException;
import com.example.mapper.NewsMapper;
import com.example.repository.mongodb.NewsRepository;
import com.example.utils.SlugUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class NewsService {

    @Inject NewsRepository newsRepository;
    @Inject NewsMapper     newsMapper;

    // ─── PUBLIC ──────────────────────────────────────────────────────────────

    public List<NewsResponse> getPublished(String category) {
        return newsRepository.findPublished(category)
                .stream()
                .map(newsMapper::toResponse)
                .collect(Collectors.toList());
    }

    public NewsResponse getBySlug(String slug) {
        News news = newsRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException("Bài viết không tồn tại", 404));

        if (!news.isPublished)
            throw new AppException("Bài viết chưa được công bố", 404);

        return newsMapper.toResponse(news);
    }

    // ─── ADMIN ───────────────────────────────────────────────────────────────

    public List<NewsResponse> getAll() {
        return newsRepository.listAll()
                .stream()
                .map(newsMapper::toResponse)
                .collect(Collectors.toList());
    }

    public NewsResponse getAdminById(String id) {
        return newsMapper.toResponse(findByIdOrThrow(id));
    }

    public NewsResponse create(User currentUser, CreateNewsRequest req) {
        validateNewsRequest(req);

        // Tự động sinh slug từ title nếu không nhập
        if (req.slug == null || req.slug.isBlank())
            req.slug = SlugUtils.toSlug(req.title);

        // Kiểm tra slug trùng
        if (newsRepository.findBySlug(req.slug).isPresent())
            throw new AppException("Slug '" + req.slug + "' đã tồn tại, hãy đổi tiêu đề hoặc slug", 409);

        News news = newsMapper.toEntity(req, currentUser.id);
        newsRepository.persist(news);
        return newsMapper.toResponse(news);
    }

    public NewsResponse update(String id, CreateNewsRequest req) {
        validateNewsRequest(req);
        News news = findByIdOrThrow(id);

        // Nếu đổi slug → check trùng
        String newSlug = (req.slug == null || req.slug.isBlank())
                ? SlugUtils.toSlug(req.title)
                : req.slug;

        if (!newSlug.equals(news.slug) && newsRepository.findBySlug(newSlug).isPresent())
            throw new AppException("Slug '" + newSlug + "' đã tồn tại", 409);

        req.slug = newSlug;
        newsMapper.updateEntity(news, req);
        newsRepository.update(news);
        return newsMapper.toResponse(news);
    }

    public void delete(String id) {
        News news = findByIdOrThrow(id);
        newsRepository.delete(news);
    }

    // ─── helpers ────────────────────────────────────────────────────────────

    private News findByIdOrThrow(String id) {
        try {
            return newsRepository.findByIdOptional(new ObjectId(id))
                    .orElseThrow(() -> new AppException("Bài viết không tồn tại", 404));
        } catch (IllegalArgumentException e) {
            throw new AppException("ID bài viết không hợp lệ", 400);
        }
    }

    private void validateNewsRequest(CreateNewsRequest req) {
        if (req.title == null || req.title.isBlank())
            throw new AppException("Tiêu đề bài viết không được để trống", 400);
        if (req.contentHtml == null || req.contentHtml.isBlank())
            throw new AppException("Nội dung bài viết không được để trống", 400);
        if (req.category == null || req.category.isBlank())
            throw new AppException("Danh mục không được để trống", 400);
    }
}