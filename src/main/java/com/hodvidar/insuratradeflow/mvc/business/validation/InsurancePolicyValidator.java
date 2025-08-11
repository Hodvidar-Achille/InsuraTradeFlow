package com.hodvidar.insuratradeflow.mvc.business.validation;

import com.hodvidar.insuratradeflow.mvc.business.domain.InsurancePolicy;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Service;

@Service
public class InsurancePolicyValidator {

    public void validate(final InsurancePolicy insurancePolicy) throws InsurancePolicyValidationException {
        if (null == insurancePolicy) {
            throw new InsurancePolicyValidationException("Given insurance policy is null");
        }
        if(Strings.isBlank(insurancePolicy.getName())) {
            throw new InsurancePolicyValidationException("Insurance policy name cannot be null or blank");
        }
        if(null == insurancePolicy.getStartDate()) {
            throw new InsurancePolicyValidationException("Insurance policy start date cannot be null");
        }
        if(null == insurancePolicy.getEndDate()) {
            throw new InsurancePolicyValidationException("Insurance policy end date cannot be null");
        }
        if(insurancePolicy.getStartDate().isAfter(insurancePolicy.getEndDate())) {
            throw new InsurancePolicyValidationException("Insurance policy start date cannot be after end date");
        }
    }
}
