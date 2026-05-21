package com.example.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.DecimalMax;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateRoomRequest {
    @NotBlank(message = "Room number is required")
    @Pattern(
        regexp = "^[0-9A-Za-z.-]+$",
        message = "Invalid room number"
    )
    public String roomNumber;

    @NotBlank(message = "Type is required")
    @Pattern(
        regexp = "STANDARD|DELUXE|SUITE|PRESIDENTIAL",
        message = "Invalid room type"
    )
    public String type;

    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    @DecimalMax(
        value = "1000000000",
        message = "Base price too large"
    )
    public Double basePrice;

    public String address;
    public String description;
    public List<String> amenities;

    public List<String> images;
    @NotNull(message = "Max occupancy is required")
    @Positive(message = "Max occupancy must be positive")
    public Integer maxOccupancy;
}   