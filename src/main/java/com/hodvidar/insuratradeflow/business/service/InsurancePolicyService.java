package com.hodvidar.insuratradeflow.business.service;

import com.hodvidar.insuratradeflow.api.dto.InsurancePolicyDto;
import com.hodvidar.insuratradeflow.business.domain.InsurancePolicy;
import com.hodvidar.insuratradeflow.business.validation.InsurancePolicyValidationException;

import java.util.List;

public interface InsurancePolicyService {

    InsurancePolicy createInsurancePolicy(InsurancePolicyDto raceDao) throws InsurancePolicyValidationException;

    List<InsurancePolicy> getAllInsurancePolicies();

    InsurancePolicy getInsurancePolicyById(Long id);

    InsurancePolicy updateInsurancePolicy(final Long id, final InsurancePolicyDto dto) throws InsurancePolicyValidationException;

    InsurancePolicy deleteInsurancePolicy(Long id);
}
