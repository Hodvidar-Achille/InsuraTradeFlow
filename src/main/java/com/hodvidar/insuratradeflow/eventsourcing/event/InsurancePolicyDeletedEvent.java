package com.hodvidar.insuratradeflow.eventsourcing.event;

import com.hodvidar.insuratradeflow.business.domain.InsurancePolicy;

public record InsurancePolicyDeletedEvent(
        Long policyId,
        InsurancePolicy deletedPolicy
) {
}
