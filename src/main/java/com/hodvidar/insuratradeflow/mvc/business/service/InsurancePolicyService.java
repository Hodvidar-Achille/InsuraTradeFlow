package com.hodvidar.insuratradeflow.mvc.business.service;

import com.hodvidar.insuratradeflow.mvc.api.dto.InsurancePolicyDto;
import com.hodvidar.insuratradeflow.mvc.business.domain.InsurancePolicy;
import com.hodvidar.insuratradeflow.mvc.business.validation.InsurancePolicyValidationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InsurancePolicyService {

    InsurancePolicy createInsurancePolicy(InsurancePolicyDto insurancePolicyDto) throws InsurancePolicyValidationException;

    Page<InsurancePolicy> getAllInsurancePolicies(Pageable pageable);

    InsurancePolicy getInsurancePolicyById(Long id);

    InsurancePolicy updateInsurancePolicy(final Long id, final InsurancePolicyDto dto) throws InsurancePolicyValidationException;

    InsurancePolicy deleteInsurancePolicy(Long id);
}
