package com.example.dto.request;

public class CreateMailTemplateRequest {
    public String type;        // CONFIRMATION, REMINDER, CANCELLATION
    public String subject;
    public String contentHtml;
}