package com.example.services;

import com.example.entity.mongodb.MailTemplate;
import com.example.entity.mysql.Booking;
import com.example.repository.mongodb.MailTemplateRepository;
import com.example.repository.mysql.BookingRepository;
import com.example.utils.MailContentBuilder;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.quarkus.narayana.jta.QuarkusTransaction;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@ApplicationScoped
public class MailSchedulerService {

    private static final Logger LOG =
            Logger.getLogger(MailSchedulerService.class.getName());

    @Inject BookingRepository      bookingRepository;
    @Inject MailTemplateRepository mailTemplateRepository;
    @Inject Mailer                 mailer;

    /**
     * Chạy mỗi phút.
     * Quét các booking CONFIRMED chưa gửi mail xác nhận → gửi.
     */
    @Scheduled(every = "60s")
    public void sendConfirmationMails() {
        Optional<MailTemplate> templateOpt =
                mailTemplateRepository.findByType("CONFIRMATION");
        if (templateOpt.isEmpty()) {
            LOG.warning("⚠️  Chưa có template CONFIRMATION trong DB, bỏ qua.");
            return;
        }
        MailTemplate template = templateOpt.get();

        List<Booking> bookings = bookingRepository.findBookingsNeedingConfirmation();
        for (Booking booking : bookings) {
            QuarkusTransaction.requiringNew().run(() -> 
                processSingleConfirmationMail(booking, template)
            );
        }
    }

    public void processSingleConfirmationMail(Booking booking, MailTemplate template) {
        try {
            String html = MailContentBuilder.build(template, booking.user, booking);
            mailer.send(
                Mail.withHtml(booking.user.email, template.subject, html)
            );
            booking.isConfirmedMailSent = true;
            bookingRepository.persist(booking);
            LOG.info("✅ Gửi mail xác nhận → " + booking.user.email);
        } catch (Exception e) {
            LOG.severe("❌ Lỗi gửi mail xác nhận cho booking #"
                    + booking.id + ": " + e.getMessage());
        }
    }

    /**
     * Chạy mỗi ngày lúc 8:00 sáng.
     * Quét các booking check-in ngày mai, chưa gửi mail nhắc nhở → gửi.
     */
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendReminderMails() {
        Optional<MailTemplate> templateOpt =
                mailTemplateRepository.findByType("REMINDER");
        if (templateOpt.isEmpty()) {
            LOG.warning("⚠️  Chưa có template REMINDER trong DB, bỏ qua.");
            return;
        }
        MailTemplate template = templateOpt.get();

        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Booking> bookings = bookingRepository.findBookingsNeedingReminder(tomorrow);

        for (Booking booking : bookings) {
            QuarkusTransaction.requiringNew().run(() -> 
                processSingleReminderMail(booking, template)
            );
        }
    }

    public void processSingleReminderMail(Booking booking, MailTemplate template) {
        try {
            String html = MailContentBuilder.build(template, booking.user, booking);
            mailer.send(
                Mail.withHtml(booking.user.email, template.subject, html)
            );
            booking.isReminderMailSent = true;
            bookingRepository.persist(booking);
            LOG.info("✅ Gửi mail nhắc nhở → " + booking.user.email);
        } catch (Exception e) {
            LOG.severe("❌ Lỗi gửi mail nhắc nhở cho booking #"
                    + booking.id + ": " + e.getMessage());
        }
    }

    /**
     * Gửi mail hủy đơn theo yêu cầu (gọi thủ công từ BookingService).
     */
    public void sendCancellationMail(Booking booking) {
        mailTemplateRepository.findByType("CANCELLATION").ifPresentOrElse(
            template -> {
                try {
                    String html = MailContentBuilder.build(template, booking.user, booking);
                    mailer.send(
                        Mail.withHtml(booking.user.email, template.subject, html)
                    );
                    LOG.info("✅ Gửi mail hủy đơn → " + booking.user.email);
                } catch (Exception e) {
                    LOG.severe("❌ Lỗi gửi mail hủy: " + e.getMessage());
                }
            },
            () -> LOG.warning("⚠️  Chưa có template CANCELLATION.")
        );
    }
}