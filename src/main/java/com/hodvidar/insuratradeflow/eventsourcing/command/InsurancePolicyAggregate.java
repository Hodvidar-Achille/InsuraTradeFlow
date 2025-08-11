package com.hodvidar.insuratradeflow.eventsourcing.command;

import com.hodvidar.insuratradeflow.eventsourcing.event.InsurancePolicyDeletedEvent;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.commandhandling.CommandHandler;
import org.axonframework.eventsourcing.EventSourcingHandler;
import org.axonframework.modelling.command.AggregateIdentifier;
import org.axonframework.spring.stereotype.Aggregate;

import static org.axonframework.modelling.command.AggregateLifecycle.apply;

// Beginning of CQRS and Event-Sourcing design
@Slf4j
@Aggregate
public class InsurancePolicyAggregate {
    @AggregateIdentifier
    private Long policyId;

    public InsurancePolicyAggregate() {
        // Required by Axon
    }

    @CommandHandler
    public InsurancePolicyAggregate(DeleteInsurancePolicyCommand command) {
        apply(new InsurancePolicyDeletedEvent(command.policyId(), command.policy()));
    }

    @EventSourcingHandler
    public void on(InsurancePolicyDeletedEvent event) {
        this.policyId = event.policyId();
        log.info("Handling Event of deletion of an Insurance Policy : {}", this.policyId);
    }
}
