package com.hodvidar.insuratradeflow.eventsourcing.command;

import com.hodvidar.insuratradeflow.mvc.business.domain.InsurancePolicy;
import org.axonframework.modelling.command.TargetAggregateIdentifier;

public record DeleteInsurancePolicyCommand(
        @TargetAggregateIdentifier Long policyId,
        InsurancePolicy policy
) {}