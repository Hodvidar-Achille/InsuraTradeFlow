package com.hodvidar.insuratradeflow.eventsourcing.event;

import com.hodvidar.insuratradeflow.eventsourcing.persistance.dao.DeletedPolicyDao;
import com.hodvidar.insuratradeflow.eventsourcing.persistance.repository.DeletedPolicyRepository;
import jakarta.transaction.Transactional;
import org.axonframework.config.ProcessingGroup;
import org.axonframework.eventhandling.EventHandler;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@ProcessingGroup("deletedPolicies")
public class DeletedPolicyEventHandler {
    private final DeletedPolicyRepository repository;

    public DeletedPolicyEventHandler(DeletedPolicyRepository repository) {
        this.repository = repository;
    }

    @EventHandler
    @Transactional
    public void handle(InsurancePolicyDeletedEvent event) {
        DeletedPolicyDao deletedPolicyDao = new DeletedPolicyDao(
                event.deletedPolicy().getId(),
                event.deletedPolicy().getName(),
                event.deletedPolicy().getStatus().name(),
                event.deletedPolicy().getStartDate(),
                event.deletedPolicy().getEndDate(),
                event.deletedPolicy().getCreationDateTime(),
                event.deletedPolicy().getUpdateDateTime(),
                LocalDateTime.now()
        );
        repository.save(deletedPolicyDao);
    }
}
