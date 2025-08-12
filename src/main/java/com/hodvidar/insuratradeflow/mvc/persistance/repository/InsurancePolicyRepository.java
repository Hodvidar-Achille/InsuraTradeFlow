package com.hodvidar.insuratradeflow.mvc.persistance.repository;

import com.hodvidar.insuratradeflow.mvc.persistance.dao.InsurancePolicyDao;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicyDao, Long> {
    @NonNull
    Page<InsurancePolicyDao> findAll(@NonNull Pageable pageable);

    // If we need filtered pagination later:
    // Page<InsurancePolicyDao> findByNameContaining(String nameFilter, Pageable pageable);
}

