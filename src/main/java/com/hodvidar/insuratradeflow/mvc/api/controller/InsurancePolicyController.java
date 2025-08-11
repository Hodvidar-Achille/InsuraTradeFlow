package com.hodvidar.insuratradeflow.mvc.api.controller;

import com.hodvidar.insuratradeflow.mvc.api.dto.InsurancePolicyDto;
import com.hodvidar.insuratradeflow.mvc.business.mapper.InsurancePolicyMapper;
import com.hodvidar.insuratradeflow.mvc.business.service.InsurancePolicyService;
import com.hodvidar.insuratradeflow.mvc.business.validation.InsurancePolicyValidationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Page<InsurancePolicyDto>> getAllInsurancePolicies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {

        Sort sorting = Sort.by(sort[0]);
        if (sort.length > 1 && sort[1].equalsIgnoreCase("desc")) {
            sorting = sorting.descending();
        } else {
            sorting = sorting.ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sorting);
        Page<InsurancePolicyDto> policyPage = insurancePolicyService.getAllInsurancePolicies(pageable)
                .map(insurancePolicyMapper::modelToDto);

        return ResponseEntity.ok(policyPage);
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

