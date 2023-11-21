package com.hodvidar.insuratradeflow.api.controller;

import com.hodvidar.insuratradeflow.api.dto.InsurancePolicyDto;
import com.hodvidar.insuratradeflow.business.mapper.InsurancePolicyMapper;
import com.hodvidar.insuratradeflow.business.service.InsurancePolicyService;
import com.hodvidar.insuratradeflow.business.validation.InsurancePolicyValidationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/insurance-policies")
public class InsurancePolicyController {

    private final InsurancePolicyService insurancePolicyService;

    private final InsurancePolicyMapper insurancePolicyMapper;

    @Autowired
    private InsurancePolicyController(final InsurancePolicyService insurancePolicyService,
                                      final InsurancePolicyMapper insurancePolicyMapper) {
        this.insurancePolicyService = insurancePolicyService;
        this.insurancePolicyMapper = insurancePolicyMapper;
    }

    @PostMapping
    public ResponseEntity<InsurancePolicyDto> createInsurancePolicy(@Valid @RequestBody InsurancePolicyDto insurancePolicy) throws InsurancePolicyValidationException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(insurancePolicyMapper.modelToDto(insurancePolicyService.createInsurancePolicy(insurancePolicy)));
    }

    @GetMapping
    public List<InsurancePolicyDto> getAllInsurancePolicies() {
        return insurancePolicyService.getAllInsurancePolicies().stream()
                .map(insurancePolicyMapper::modelToDto)
                .toList();
    }

    @GetMapping("/{id}")
    public InsurancePolicyDto getInsurancePolicy(@PathVariable Long id) {
        return insurancePolicyMapper.modelToDto(insurancePolicyService.getInsurancePolicyById(id));
    }

    @PutMapping("/{id}")
    public InsurancePolicyDto updateInsurancePolicy(@PathVariable Long id, @RequestBody InsurancePolicyDto insurancePolicyDto) throws InsurancePolicyValidationException {
        return insurancePolicyMapper.modelToDto(insurancePolicyService.updateInsurancePolicy(id, insurancePolicyDto));
    }

    @DeleteMapping("/{id}")
    public InsurancePolicyDto deleteInsurancePolicy(@PathVariable Long id) {
        return insurancePolicyMapper.modelToDto(insurancePolicyService.deleteInsurancePolicy(id));
    }
}

