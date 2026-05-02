package com.example.services;

import com.example.dto.request.CreateVoucherRequest;
import com.example.dto.response.VoucherResponse;
import com.example.entity.mysql.Voucher;
import com.example.exceptions.AppException;
import com.example.mapper.VoucherMapper;
import com.example.repository.mysql.VoucherRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class VoucherService {

    @Inject VoucherRepository voucherRepository;
    @Inject VoucherMapper     voucherMapper;

    /** Dùng cho Customer: kiểm tra & tính tiền giảm (không trừ quantity) */
    public VoucherResponse validateVoucher(String code, Double totalPrice) {
        if (code == null || code.isBlank())
            throw new AppException("Mã voucher không được để trống", 400);
        if (totalPrice == null || totalPrice <= 0)
            throw new AppException("Giá trị đơn hàng không hợp lệ", 400);

        Voucher v = findByCodeOrThrow(code);
        checkVoucherUsable(v, totalPrice);

        return voucherMapper.toResponse(v);
    }

    // ─── ADMIN ───────────────────────────────────────────────────────────────

    public List<VoucherResponse> getAll() {
        return voucherRepository.listAll()
                .stream()
                .map(voucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    public VoucherResponse getById(Long id) {
        return voucherMapper.toResponse(findByIdOrThrow(id));
    }

    @Transactional
    public VoucherResponse create(CreateVoucherRequest req) {
        validateVoucherRequest(req);

        if (voucherRepository.findByCode(req.code).isPresent())
            throw new AppException("Mã voucher '" + req.code + "' đã tồn tại", 409);

        Voucher v = voucherMapper.toEntity(req);
        voucherRepository.persist(v);
        return voucherMapper.toResponse(v);
    }

    @Transactional
    public VoucherResponse update(Long id, CreateVoucherRequest req) {
        validateVoucherRequest(req);

        Voucher v = findByIdOrThrow(id);

        // Nếu đổi code → check trùng
        if (!v.code.equals(req.code)
                && voucherRepository.findByCode(req.code).isPresent())
            throw new AppException("Mã voucher '" + req.code + "' đã tồn tại", 409);

        voucherMapper.updateEntity(v, req);
        voucherRepository.persist(v);
        return voucherMapper.toResponse(v);
    }

    @Transactional
    public VoucherResponse toggleStatus(Long id) {
        Voucher v = findByIdOrThrow(id);
        v.status = !v.status;
        voucherRepository.persist(v);
        return voucherMapper.toResponse(v);
    }

    @Transactional
    public void delete(Long id) {
        Voucher v = findByIdOrThrow(id);
        voucherRepository.delete(v);
    }

    // ─── helpers ────────────────────────────────────────────────────────────

    private Voucher findByIdOrThrow(Long id) {
        return voucherRepository.findByIdOptional(id)
                .orElseThrow(() -> new AppException("Voucher không tồn tại", 404));
    }

    private Voucher findByCodeOrThrow(String code) {
        return voucherRepository.findByCode(code)
                .orElseThrow(() -> new AppException("Mã voucher không hợp lệ", 400));
    }

    private void checkVoucherUsable(Voucher v, double totalPrice) {
        if (!v.status)
            throw new AppException("Voucher không còn hiệu lực", 400);
        if (v.quantity <= 0)
            throw new AppException("Voucher đã hết lượt sử dụng", 400);
        if (v.expiryDate.isBefore(LocalDate.now()))
            throw new AppException("Voucher đã hết hạn", 400);
        if (totalPrice < v.minOrderValue)
            throw new AppException(
                String.format("Đơn hàng tối thiểu %.0f VNĐ mới áp dụng được voucher này",
                    v.minOrderValue), 400);
    }

    private void validateVoucherRequest(CreateVoucherRequest req) {
        if (req.code == null || req.code.isBlank())
            throw new AppException("Mã voucher không được để trống", 400);
        if (req.discountPercent == null || req.discountPercent <= 0 || req.discountPercent > 100)
            throw new AppException("Phần trăm giảm phải từ 1 đến 100", 400);
        if (req.maxDiscountAmount == null || req.maxDiscountAmount <= 0)
            throw new AppException("Số tiền giảm tối đa phải lớn hơn 0", 400);
        if (req.minOrderValue == null || req.minOrderValue < 0)
            throw new AppException("Giá trị đơn tối thiểu không hợp lệ", 400);
        if (req.expiryDate == null || req.expiryDate.isBefore(LocalDate.now()))
            throw new AppException("Ngày hết hạn phải ở tương lai", 400);
        if (req.quantity == null || req.quantity <= 0)
            throw new AppException("Số lượng voucher phải lớn hơn 0", 400);
    }
}