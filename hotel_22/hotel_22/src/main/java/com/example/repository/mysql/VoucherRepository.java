package com.example.repository.mysql;

import com.example.entity.mysql.Voucher;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class VoucherRepository implements PanacheRepository<Voucher> {
    public Optional<Voucher> findByCode(String code) {
        return find("code", code).firstResultOptional();
    }
}