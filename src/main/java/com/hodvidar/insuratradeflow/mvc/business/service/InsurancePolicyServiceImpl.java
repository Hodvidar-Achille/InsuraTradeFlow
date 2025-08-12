package com.hodvidar.insuratradeflow.mvc.business.service;

import com.hodvidar.insuratradeflow.mvc.api.dto.InsurancePolicyDto;
import com.hodvidar.insuratradeflow.mvc.business.domain.InsurancePolicy;
import com.hodvidar.insuratradeflow.mvc.business.mapper.InsurancePolicyMapper;
import com.hodvidar.insuratradeflow.mvc.business.validation.InsurancePolicyValidationException;
import com.hodvidar.insuratradeflow.mvc.business.validation.InsurancePolicyValidator;
import com.hodvidar.insuratradeflow.eventsourcing.command.DeleteInsurancePolicyCommand;
import com.hodvidar.insuratradeflow.mvc.persistance.dao.InsurancePolicyDao;
import com.hodvidar.insuratradeflow.mvc.persistance.repository.InsurancePolicyRepository;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.commandhandling.gateway.CommandGateway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@Transactional
public class InsurancePolicyServiceImpl implements InsurancePolicyService {

    private final InsurancePolicyRepository insurancePolicyRepository;
    private final InsurancePolicyMapper insurancePolicyMapper;
    private final InsurancePolicyValidator insurancePolicyValidator;

    private final CommandGateway commandGateway;

    @Autowired
    public InsurancePolicyServiceImpl(final InsurancePolicyRepository insurancePolicyRepository,
                                      final InsurancePolicyMapper insurancePolicyMapper,
                                      final InsurancePolicyValidator insurancePolicyValidator,
                                      final CommandGateway commandGateway) {
        this.insurancePolicyRepository = insurancePolicyRepository;
        this.insurancePolicyMapper = insurancePolicyMapper;
        this.insurancePolicyValidator = insurancePolicyValidator;
        this.commandGateway = commandGateway;
    }

    @Override
    public InsurancePolicy createInsurancePolicy(final InsurancePolicyDto insurancePolicyDto) throws InsurancePolicyValidationException {
        InsurancePolicy newInsurancePolicy = insurancePolicyMapper.dtoToModel(insurancePolicyDto);
        insurancePolicyValidator.validate(newInsurancePolicy);
        final InsurancePolicyDao save = insurancePolicyRepository.save(insurancePolicyMapper.modelToEntity(newInsurancePolicy));
        final InsurancePolicy savedInsurancePolicy = insurancePolicyMapper.entityToModel(save);
        log.info("Created a new Insurance Policy: {}", savedInsurancePolicy);
        return savedInsurancePolicy;
    }


    @Override
    public Page<InsurancePolicy> getAllInsurancePolicies(Pageable pageable) {
        return insurancePolicyRepository.findAll(pageable)
                .map(insurancePolicyMapper::entityToModel);
    }

    @Override
    public InsurancePolicy getInsurancePolicyById(final Long id) {
        Optional<InsurancePolicyDao> insurancePolicyDao = insurancePolicyRepository.findById(id);
        return insurancePolicyDao.map(insurancePolicyMapper::entityToModel).orElse(null);
    }

    @Override
    public InsurancePolicy updateInsurancePolicy(final Long id, final InsurancePolicyDto dto)
            throws InsurancePolicyValidationException {
        Optional<InsurancePolicyDao> existingPolicy = insurancePolicyRepository.findById(id);
        if (existingPolicy.isEmpty()) {
            log.info("No Insurance Policy found for given id '{}', update action cannot be performed", id);
            throw new IllegalArgumentException("No Insurance Policy for given id '" + id + "'");
        }
        InsurancePolicyDao existingPolicyDao = getInsurancePolicyWithModifications(dto, existingPolicy.get());
        // using save(dao) works but does not return the proper updateDateTime
        InsurancePolicyDao savedPolicyDao = insurancePolicyRepository.saveAndFlush(existingPolicyDao);
        InsurancePolicy savedPolicy = insurancePolicyMapper.entityToModel(savedPolicyDao);
        log.info("Updated Insurance Policy: {}", savedPolicy);
        return savedPolicy;
    }

    private InsurancePolicyDao getInsurancePolicyWithModifications(final InsurancePolicyDto dto,
                                                                   final InsurancePolicyDao existingPolicy)
            throws InsurancePolicyValidationException {
        InsurancePolicy updatedPolicy = insurancePolicyMapper.dtoToModel(dto);
        insurancePolicyValidator.validate(updatedPolicy);
        existingPolicy.setName(updatedPolicy.getName());
        existingPolicy.setStatus(updatedPolicy.getStatus());
        existingPolicy.setStartDate(updatedPolicy.getStartDate());
        existingPolicy.setEndDate(updatedPolicy.getEndDate());
        return existingPolicy;
    }

    @Override
    public InsurancePolicy deleteInsurancePolicy(final Long id) {
        Optional<InsurancePolicyDao> existingInsurancePolicyDao = insurancePolicyRepository.findById(id);
        if (existingInsurancePolicyDao.isEmpty()) {
            log.info("No Insurance Policy for given id '{}', deletion action does nothing", id);
            // Could be removed to avoid returning a Bad Request in case of several same calls
            // Note: idempotentcy will not be achieved by avoiding the error as second call will
            //       return an empty object anyway.
            throw new IllegalArgumentException("No Insurance Policy for given id '" + id + "'");
        } else {
            final InsurancePolicyDao insurancePolicyDao = existingInsurancePolicyDao.get();
            commandGateway.sendAndWait(new DeleteInsurancePolicyCommand(id, insurancePolicyMapper.entityToModel(insurancePolicyDao)));
            insurancePolicyRepository.delete(insurancePolicyDao);
            log.info("Deleted an Insurance Policy : {}", insurancePolicyDao);
        }
        return existingInsurancePolicyDao.map(insurancePolicyMapper::entityToModel).orElse(null);
    }
}
