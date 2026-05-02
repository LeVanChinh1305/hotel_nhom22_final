package com.example.dto.request;

import java.time.LocalDate;

public class CreateVoucherRequest {
    public String code;
    public Integer discountPercent;
    public Double maxDiscountAmount;
    public Double minOrderValue;
    public LocalDate expiryDate;
    public Integer quantity;
}