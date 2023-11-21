package com.hodvidar.insuratradeflow.persistance.repository;

import com.hodvidar.insuratradeflow.persistance.dao.InsurancePolicyDao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicyDao, Long> {
    // Additional query methods can be defined here if needed
}

