package com.example.utils;

import com.example.entity.mongodb.MailTemplate;
import com.example.entity.mysql.Booking;
import com.example.entity.mysql.User;

/**
 * Điền biến vào template HTML mail
 * Template hỗ trợ: {{fullName}}, {{roomId}}, {{checkInDate}},
 *                  {{checkOutDate}}, {{totalPrice}}, {{bookingId}}
 */
public class MailContentBuilder {

    public static String build(MailTemplate template, User user, Booking booking) {
        return template.contentHtml
                .replace("{{fullName}}",    safe(user.fullName))
                .replace("{{email}}",       safe(user.email))
                .replace("{{bookingId}}",   safe(String.valueOf(booking.id)))
                .replace("{{roomId}}",      safe(booking.roomId))
                .replace("{{checkInDate}}", safe(booking.checkInDate.toString()))
                .replace("{{checkOutDate}}",safe(booking.checkOutDate.toString()))
                .replace("{{totalPrice}}",  safe(String.format("%,.0f VNĐ", booking.totalPrice)));
    }

    private static String safe(String value) {
        return value != null ? value : "";
    }
}