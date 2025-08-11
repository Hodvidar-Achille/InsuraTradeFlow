package com.hodvidar.insuratradeflow.eventsourcing.query;

import com.hodvidar.insuratradeflow.eventsourcing.persistance.dao.DeletedPolicyDao;
import com.hodvidar.insuratradeflow.eventsourcing.persistance.repository.DeletedPolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/deleted-insurance-policies")
public class DeletedPolicyQueryController {

    // TODO use proper query CQRS pattern
    private final DeletedPolicyRepository repository;

    @Autowired
    public DeletedPolicyQueryController(DeletedPolicyRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<DeletedInsurancePolicyDto> getAllDeletedPolicies() {
        return repository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private DeletedInsurancePolicyDto convertToDto(DeletedPolicyDao dao) {
        return new DeletedInsurancePolicyDto(
                dao.getId(),
                dao.getName(),
                dao.getStatus(),
                dao.getStartDate(),
                dao.getEndDate(),
                dao.getCreationDateTime(),
                dao.getUpdateDateTime(),
                dao.getDeletionDateTime()
        );
    }
}
