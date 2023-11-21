package com.hodvidar.insuratradeflow.business.validation;

import com.hodvidar.insuratradeflow.business.domain.InsurancePolicy;
import org.springframework.stereotype.Service;

@Service
public class InsurancePolicyValidator {

    public void validate(final InsurancePolicy insurancePolicy) throws InsurancePolicyValidationException {
        if (null == insurancePolicy) {
            throw new InsurancePolicyValidationException("Given insurance policy is null");
        }
        // TODO: Add more validation rules here
    }
}
