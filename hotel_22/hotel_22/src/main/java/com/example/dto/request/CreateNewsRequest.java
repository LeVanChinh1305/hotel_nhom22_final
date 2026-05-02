package com.example.dto.request;

public class CreateNewsRequest {
    public String title;
    public String slug;
    public String contentHtml;
    public String thumbnail;
    public String category;
    public Boolean isPublished = false;
}