package com.hodvidar.insuratradeflow.business.service;

import com.hodvidar.insuratradeflow.api.dto.InsurancePolicyDto;
import com.hodvidar.insuratradeflow.business.domain.InsurancePolicy;
import com.hodvidar.insuratradeflow.business.mapper.InsurancePolicyMapper;
import com.hodvidar.insuratradeflow.business.validation.InsurancePolicyValidationException;
import com.hodvidar.insuratradeflow.business.validation.InsurancePolicyValidator;
import com.hodvidar.insuratradeflow.persistance.dao.InsurancePolicyDao;
import com.hodvidar.insuratradeflow.persistance.repository.InsurancePolicyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
public class InsurancePolicyServiceImpl implements InsurancePolicyService {

    private final InsurancePolicyRepository insurancePolicyRepository;
    private final InsurancePolicyMapper insurancePolicyMapper;
    private final InsurancePolicyValidator insurancePolicyValidator;

    @Autowired
    public InsurancePolicyServiceImpl(final InsurancePolicyRepository insurancePolicyRepository,
                                      final InsurancePolicyMapper insurancePolicyMapper,
                                      final InsurancePolicyValidator insurancePolicyValidator) {
        this.insurancePolicyRepository = insurancePolicyRepository;
        this.insurancePolicyMapper = insurancePolicyMapper;
        this.insurancePolicyValidator = insurancePolicyValidator;
    }

    @Override
    public InsurancePolicy createInsurancePolicy(final InsurancePolicyDto dto) throws InsurancePolicyValidationException {
        InsurancePolicy newInsurancePolicy = insurancePolicyMapper.dtoToModel(dto);
        insurancePolicyValidator.validate(newInsurancePolicy);
        final InsurancePolicyDao save = insurancePolicyRepository.save(insurancePolicyMapper.modelToEntity(newInsurancePolicy));
        final InsurancePolicy savedInsurancePolicy = insurancePolicyMapper.entityToModel(save);
        log.info("Created a new Insurance Policy: {}", savedInsurancePolicy);
        return savedInsurancePolicy;
    }


    @Override
    public List<InsurancePolicy> getAllInsurancePolicies() {
        return insurancePolicyRepository.findAll().stream()
                .map(insurancePolicyMapper::entityToModel)
                .toList();
    }

    @Override
    public InsurancePolicy getInsurancePolicyById(final Long id) {
        Optional<InsurancePolicyDao> raceDao = insurancePolicyRepository.findById(id);
        return raceDao.map(insurancePolicyMapper::entityToModel).orElse(null);
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
        existingPolicy.setName(updatedPolicy.getName());
        existingPolicy.setStatus(updatedPolicy.getStatus());
        existingPolicy.setStartDate(updatedPolicy.getStartDate());
        existingPolicy.setEndDate(updatedPolicy.getEndDate());
        insurancePolicyValidator.validate(updatedPolicy);
        return existingPolicy;
    }

    @Override
    public InsurancePolicy deleteInsurancePolicy(final Long id) {
        Optional<InsurancePolicyDao> raceDao = insurancePolicyRepository.findById(id);
        if (raceDao.isEmpty()) {
            log.info("No Insurance Policy for given id '{}', deletion action does nothing", id);
            // Could be removed to avoid returning a Bad Request in case of several same calls
            // Note: idempotentcy will not be achieved by avoiding the error as second call will
            //       return an empty object anyway.
            throw new IllegalArgumentException("No Insurance Policy for given id '" + id + "'");
        } else {
            final InsurancePolicyDao insurancePolicyDao = raceDao.get();
            insurancePolicyRepository.delete(insurancePolicyDao);
            log.info("Deleted an Insurance Policy : {}", insurancePolicyDao);
        }
        return raceDao.map(insurancePolicyMapper::entityToModel).orElse(null);
    }
}
