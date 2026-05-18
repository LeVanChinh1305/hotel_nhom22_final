package com.example.services;

import com.example.dto.request.BookingRequest;
import com.example.dto.response.BookingResponse;
import com.example.entity.mongodb.Room;
import com.example.entity.mongodb.Service;
import com.example.entity.mysql.*;
import com.example.exceptions.AppException;
import com.example.mapper.BookingMapper;
import com.example.repository.mongodb.RoomRepository;
import com.example.repository.mongodb.ServiceRepository;
import com.example.repository.mongodb.RoomAvailabilityRepository;
import com.example.repository.mysql.*;
import com.example.utils.DateUtils;
import com.example.utils.PriceUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.bson.types.ObjectId;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class BookingService {

    @Inject BookingRepository             bookingRepository;
    @Inject BookingServiceItemRepository  bookingServiceItemRepository;
    @Inject VoucherRepository             voucherRepository;
    @Inject RoomRepository                roomRepository;
    @Inject ServiceRepository             serviceRepository;
    @Inject RoomAvailabilityRepository    roomAvailabilityRepository;
    @Inject BookingMapper                 bookingMapper;

    // ─── CUSTOMER ────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponse createBooking(User currentUser, BookingRequest req) {

        // 1. Validate ngày
        if (req.checkInDate == null || req.checkOutDate == null)
            throw new AppException("Ngày nhận/trả phòng không được để trống", 400);
        if (DateUtils.isPast(req.checkInDate))
            throw new AppException("Ngày nhận phòng không được ở quá khứ", 400);
        
        long nights;
        try {
            nights = DateUtils.countNights(req.checkInDate, req.checkOutDate);
        } catch (IllegalArgumentException e) {
            throw new AppException(e.getMessage(), 400);
        }

        // 2. Kiểm tra phòng trống
        System.err.println(">>> [createBooking] Checking availability for Room: " + req.roomId + " from " + req.checkInDate + " to " + req.checkOutDate);
        if (!roomAvailabilityRepository.isRoomAvailable(req.roomId, req.checkInDate, req.checkOutDate)) {
            System.err.println(">>> [createBooking] Conflict detected for Room: " + req.roomId);
            throw new AppException("Phòng đã được đặt hoặc không khả dụng trong khoảng thời gian này", 409);
        }

        // 3. Lấy thông tin phòng & tính tiền phòng
        Room room = findRoomOrThrow(req.roomId);
        double roomPrice = PriceUtils.round(room.basePrice * nights);

        // 4. Tính tiền dịch vụ & chuẩn bị danh sách booking service items
        double servicePrice = 0;
        List<BookingServiceItem> items = new ArrayList<>();

        if (req.services != null && !req.services.isEmpty()) {
            for (BookingRequest.BookingServiceItemRequest sr : req.services) {
                Service svc = findServiceOrThrow(sr.serviceId);

                if (!svc.isAvailable)
                    throw new AppException("Dịch vụ '" + svc.serviceName + "' hiện không còn cung cấp", 400);

                double itemTotal;
                Integer effectiveQuantity;
                Integer numPeopleToStore = null;
                Integer numDaysToStore = null;

                if (svc.unit == Service.ServiceUnit.NGUOI_NGAY) {
                    if (sr.numberOfPeople == null || sr.numberOfPeople <= 0 ||
                        sr.numberOfDays == null || sr.numberOfDays <= 0) {
                        throw new AppException("Dịch vụ '" + svc.serviceName + "' yêu cầu nhập số người và số ngày", 400);
                    }
                    effectiveQuantity = sr.numberOfPeople * sr.numberOfDays;
                    numPeopleToStore = sr.numberOfPeople;
                    numDaysToStore = sr.numberOfDays;
                } else if (svc.unit == Service.ServiceUnit.NGUOI) {
                    if (sr.numberOfPeople == null || sr.numberOfPeople <= 0) {
                        throw new AppException("Dịch vụ '" + svc.serviceName + "' yêu cầu nhập số người", 400);
                    }
                    effectiveQuantity = sr.numberOfPeople;
                    numPeopleToStore = sr.numberOfPeople;
                } else if (svc.unit == Service.ServiceUnit.NGAY) {
                    if (sr.numberOfDays == null || sr.numberOfDays <= 0) {
                        // Mặc định số ngày là số đêm của booking nếu không nhập
                        effectiveQuantity = (int) nights;
                    } else {
                        effectiveQuantity = sr.numberOfDays;
                    }
                    numDaysToStore = effectiveQuantity; // Lưu số ngày thực tế được tính
                } else {
                    if (sr.quantity == null || sr.quantity <= 0)
                        throw new AppException("Số lượng dịch vụ '" + svc.serviceName + "' phải lớn hơn 0", 400);
                    effectiveQuantity = sr.quantity;
                }
                
                itemTotal = PriceUtils.round(svc.price * effectiveQuantity);

                servicePrice += itemTotal;

                BookingServiceItem item = new BookingServiceItem();
                item.serviceId       = sr.serviceId;
                item.quantity        = effectiveQuantity;
                item.numberOfPeople  = numPeopleToStore;
                item.numberOfDays    = numDaysToStore;
                item.priceAtBooking  = svc.price;   // Lưu giá tại thời điểm đặt
                items.add(item);
            }
        }

        // 5. Áp dụng voucher (nếu có)
        double discount = 0;
        Voucher appliedVoucher = null;

        if (req.voucherCode != null && !req.voucherCode.isBlank()) {
            appliedVoucher = validateAndConsumeVoucher(
                    req.voucherCode, roomPrice + servicePrice
            );
            discount = PriceUtils.calcDiscount(
                    roomPrice + servicePrice,
                    appliedVoucher.discountPercent,
                    appliedVoucher.maxDiscountAmount
            );
        }

        // 6. Tính tổng tiền cuối
        double totalPrice = PriceUtils.calcTotal(roomPrice, servicePrice, discount);

        // 7. Validate currentUser
        if (currentUser == null || currentUser.getId() == null) {
            throw new AppException("Người dùng chưa đăng nhập", 401);
        }

        // 8. Tạo Booking
        Booking booking = new Booking();
        booking.user              = currentUser;
        booking.roomId            = req.roomId;
        booking.voucher           = appliedVoucher;
        booking.checkInDate       = req.checkInDate;
        booking.checkOutDate      = req.checkOutDate;
        booking.totalRoomPrice    = roomPrice;
        booking.totalServicePrice = PriceUtils.round(servicePrice);
        booking.discountAmount    = PriceUtils.round(discount);
        booking.totalPrice        = PriceUtils.round(totalPrice);
        booking.status            = Booking.BookingStatus.PENDING;
        booking.paymentStatus     = false;



        bookingRepository.persist(booking);

        // 9. Cập nhật trạng thái phòng thành BOOKED
        roomAvailabilityRepository.updateRoomStatusRange(req.roomId, req.checkInDate, req.checkOutDate, "BOOKED", booking.id);

        // 10. Lưu từng booking service item
        for (BookingServiceItem item : items) {
            item.booking = booking;
            bookingServiceItemRepository.persist(item);
        }

        System.err.println(">>> [createBooking] Booking created SUCCESSFULLY: ID=" + booking.id);
        return bookingMapper.toResponse(booking);
    }

    public List<BookingResponse> getMyBookings(Long userId) {
        System.err.println(">>> [getMyBookings] Fetching bookings for UserID: " + userId);
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        System.err.println(">>> [getMyBookings] Found " + (bookings != null ? bookings.size() : 0) + " bookings");
        
        if (bookings == null) return new ArrayList<>();
        return bookings
                .stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getMyBookingById(Long bookingId, Long userId) {
        Booking booking = findBookingOrThrow(bookingId);
        if (!booking.user.id.equals(userId))
            throw new AppException("Không có quyền xem đơn này", 403);
        return bookingMapper.toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = findBookingOrThrow(bookingId);

        if (!booking.user.id.equals(userId))
            throw new AppException("Không có quyền hủy đơn này", 403);

        if (booking.status == Booking.BookingStatus.CANCELLED)
            throw new AppException("Đơn đặt phòng đã được hủy trước đó", 400);

        if (booking.status == Booking.BookingStatus.COMPLETED)
            throw new AppException("Không thể hủy đơn đã hoàn tất", 400);

        // Hoàn lại số lượng voucher nếu đã dùng
        if (booking.voucher != null) {
            booking.voucher.quantity++;
            voucherRepository.persist(booking.voucher);
        }

        booking.status = Booking.BookingStatus.CANCELLED;
        bookingRepository.persist(booking);
        
        // Giải phóng phòng trong MongoDB
        updateRoomAvailabilityForBooking(booking);

        System.err.println(">>> [cancelBooking] Booking CANCELLED successfully: ID=" + bookingId);
        return bookingMapper.toResponse(booking);
    }

    // ─── ADMIN ───────────────────────────────────────────────────────────────

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.listAll()
                .stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByStatus(String status) {
        try {
            Booking.BookingStatus bs = Booking.BookingStatus.valueOf(status.toUpperCase());
            return bookingRepository.find("status", bs)
                    .stream()
                    .map(bookingMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new AppException("Trạng thái không hợp lệ: " + status, 400);
        }
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId,
                                               String newStatus,
                                               Boolean paymentStatus) {
        Booking booking = findBookingOrThrow(bookingId);

        if (newStatus != null) {
            try {
                Booking.BookingStatus bs = Booking.BookingStatus.valueOf(newStatus.toUpperCase());

                // Validate chuyển trạng thái hợp lý
                validateStatusTransition(booking, bs);
                booking.status = bs;
            } catch (IllegalArgumentException e) {
                throw new AppException("Trạng thái không hợp lệ: " + newStatus, 400);
            }
        }

        if (paymentStatus != null) {
            booking.paymentStatus = paymentStatus;
        }

        bookingRepository.persist(booking);

        // Cập nhật trạng thái phòng dựa trên booking status
        updateRoomAvailabilityForBooking(booking);

        return bookingMapper.toResponse(booking);
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    private Booking findBookingOrThrow(Long id) {
        return bookingRepository.findByIdOptional(id)
                .orElseThrow(() -> new AppException("Đơn đặt phòng không tồn tại", 404));
    }

    private Room findRoomOrThrow(String roomId) {
        try {
            return roomRepository.findByIdOptional(new ObjectId(roomId))
                    .orElseThrow(() -> new AppException("Phòng không tồn tại", 404));
        } catch (IllegalArgumentException e) {
            throw new AppException("ID phòng không hợp lệ", 400);
        }
    }

    private Service findServiceOrThrow(String serviceId) {
        try {
            return serviceRepository.findByIdOptional(new ObjectId(serviceId))
                    .orElseThrow(() -> new AppException("Dịch vụ không tồn tại", 404));
        } catch (IllegalArgumentException e) {
            throw new AppException("ID dịch vụ không hợp lệ", 400);
        }
    }

    private void updateRoomAvailabilityForBooking(Booking booking) {
        String newStatus;
        switch (booking.status) {
            case CONFIRMED:
            case CHECKED_IN:
            case PENDING:
                newStatus = "BOOKED";
                break;
            case COMPLETED:
            case CANCELLED:
                newStatus = "AVAILABLE";
                break;
            default:
                newStatus = "AVAILABLE";
        }

        Long bookingId = (booking.status == Booking.BookingStatus.CONFIRMED 
                         || booking.status == Booking.BookingStatus.CHECKED_IN
                         || booking.status == Booking.BookingStatus.PENDING)
                ? booking.id : null;
        
        roomAvailabilityRepository.updateRoomStatusRange(booking.roomId, booking.checkInDate, booking.checkOutDate, newStatus, bookingId);
    }

    /**
     * Validate voucher và trừ số lượng (trong cùng transaction)
     */
    @Transactional
    public Voucher validateAndConsumeVoucher(String code, double subtotal) {
        Voucher v = voucherRepository.findByCode(code)
                .orElseThrow(() -> new AppException("Mã voucher không hợp lệ", 400));

        if (!v.status)
            throw new AppException("Voucher không còn hiệu lực", 400);
        if (v.quantity <= 0)
            throw new AppException("Voucher đã hết lượt sử dụng", 400);
        if (v.expiryDate.isBefore(LocalDate.now()))
            throw new AppException("Voucher đã hết hạn", 400);
        if (subtotal < v.minOrderValue)
            throw new AppException(
                String.format("Đơn hàng tối thiểu %.0f VNĐ mới được dùng voucher này", v.minOrderValue),
                400
            );

        v.quantity--;
        voucherRepository.persist(v);
        return v;
    }

    /**
     * Quy tắc chuyển trạng thái:
     * PENDING  → CONFIRMED hoặc CANCELLED
     * CONFIRMED → COMPLETED hoặc CANCELLED
     * COMPLETED / CANCELLED → không thể thay đổi
     */
    private void validateStatusTransition(Booking booking,
                                          Booking.BookingStatus next) {
        Booking.BookingStatus current = booking.status;
        if (current == next) return; // Không đổi trạng thái thì luôn hợp lệ
        boolean valid = switch (current) {
            case PENDING    -> next == Booking.BookingStatus.CONFIRMED
                            || next == Booking.BookingStatus.CANCELLED;
            case CONFIRMED  -> next == Booking.BookingStatus.CHECKED_IN
                            || next == Booking.BookingStatus.CANCELLED
                            || next == Booking.BookingStatus.COMPLETED;
            case CHECKED_IN -> next == Booking.BookingStatus.COMPLETED
                            || next == Booking.BookingStatus.CANCELLED;
            default         -> false;
        };
        if (!valid)
            throw new AppException(
                "Không thể chuyển từ " + current + " sang " + next, 400
            );

        // Kiểm tra điều kiện thời gian thực tế để nhận phòng
        LocalDate today = LocalDate.now();
        if (current == Booking.BookingStatus.CONFIRMED && next == Booking.BookingStatus.CHECKED_IN) {
            if (today.isBefore(booking.checkInDate)) {
                throw new AppException("Chỉ được chuyển sang trạng thái CHECKED_IN kể từ ngày nhận phòng (" + booking.checkInDate + ")", 400);
            }
        }

        // Kiểm tra điều kiện thời gian thực tế để trả phòng
        if (current == Booking.BookingStatus.CHECKED_IN && next == Booking.BookingStatus.COMPLETED) {
            if (today.isBefore(booking.checkOutDate)) {
                throw new AppException("Chỉ được chuyển sang trạng thái COMPLETED kể từ ngày trả phòng (" + booking.checkOutDate + ")", 400);
            }
        }
    }
}