package com.hodvidar.insuratradeflow.mvc.business.service;


import com.hodvidar.insuratradeflow.mvc.api.dto.InsurancePolicyDto;
import com.hodvidar.insuratradeflow.mvc.business.domain.InsurancePolicy;
import com.hodvidar.insuratradeflow.mvc.business.domain.PolicyStatus;
import com.hodvidar.insuratradeflow.mvc.business.mapper.InsurancePolicyMapper;
import com.hodvidar.insuratradeflow.mvc.business.mapper.InsurancePolicyMapperImpl;
import com.hodvidar.insuratradeflow.mvc.business.service.InsurancePolicyServiceImpl;
import com.hodvidar.insuratradeflow.mvc.business.validation.InsurancePolicyValidationException;
import com.hodvidar.insuratradeflow.mvc.business.validation.InsurancePolicyValidator;
import com.hodvidar.insuratradeflow.mvc.persistance.dao.InsurancePolicyDao;
import com.hodvidar.insuratradeflow.mvc.persistance.repository.InsurancePolicyRepository;
import org.axonframework.commandhandling.gateway.CommandGateway;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;


@SpringBootTest
@ActiveProfiles("test")
class InsurancePolicyServiceTest {

    @Mock
    private InsurancePolicyRepository insurancePolicyRepository;

    @Spy
    private InsurancePolicyMapper insurancePolicyMapper = new InsurancePolicyMapperImpl();

    @Mock
    private InsurancePolicyValidator insurancePolicyValidator;

    @Mock
    private CommandGateway commandGateway;

    @InjectMocks
    private InsurancePolicyServiceImpl insurancePolicyService;


    @Test
    void createInsurancePolicy() throws InsurancePolicyValidationException {
        InsurancePolicyDto policyToCreate = new InsurancePolicyDto(null, "Policy One", "ACTIVE", LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);
        InsurancePolicyDao mockedPolicy = new InsurancePolicyDao(1L, "Policy One", PolicyStatus.ACTIVE, LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);

        when(insurancePolicyRepository.save(ArgumentMatchers.any(InsurancePolicyDao.class))).thenReturn(mockedPolicy);

        InsurancePolicy createdPolicy = insurancePolicyService.createInsurancePolicy(policyToCreate);

        assertNotNull(createdPolicy);
        assertEquals("Policy One", createdPolicy.getName());
        assertEquals(PolicyStatus.ACTIVE, createdPolicy.getStatus());
        verify(insurancePolicyValidator, times(1)).validate(any(InsurancePolicy.class));
    }


    @Test
    void getAllInsurancePolicies() {
        // 1. Create test data
        InsurancePolicyDao mockedPolicy1 = new InsurancePolicyDao(1L, "Policy One", PolicyStatus.ACTIVE,
                LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);
        InsurancePolicyDao mockedPolicy2 = new InsurancePolicyDao(2L, "Policy Two", PolicyStatus.INACTIVE,
                LocalDate.of(2023, 2, 1), LocalDate.of(2024, 2, 1), null, null);

        // 2. Create a page of results
        Page<InsurancePolicyDao> mockedPage = new PageImpl<>(
                List.of(mockedPolicy1, mockedPolicy2),
                PageRequest.of(0, 10), // page 0, size 10
                2L // total elements
        );

        // 3. Mock the repository call with Pageable
        when(insurancePolicyRepository.findAll(any(Pageable.class))).thenReturn(mockedPage);

        // 4. Call the service method with pageable
        Pageable pageable = PageRequest.of(0, 10);
        Page<InsurancePolicy> resultPage = insurancePolicyService.getAllInsurancePolicies(pageable);

        // 5. Get the content from the page
        List<InsurancePolicy> policies = resultPage.getContent();

        // 6. Assertions
        assertNotNull(policies);
        assertEquals(2, policies.size());
        assertEquals("Policy One", policies.get(0).getName());
        assertEquals(PolicyStatus.ACTIVE, policies.get(0).getStatus());
        assertEquals("Policy Two", policies.get(1).getName());
        assertEquals(PolicyStatus.INACTIVE, policies.get(1).getStatus());

        // Additional assertions for pagination metadata
        assertEquals(0, resultPage.getNumber()); // current page
        assertEquals(10, resultPage.getSize()); // page size
        assertEquals(2, resultPage.getTotalElements()); // total elements
        assertEquals(1, resultPage.getTotalPages()); // total pages
    }

    @Test
    void getInsurancePolicyById() {
        InsurancePolicyDao mockedPolicy = new InsurancePolicyDao(1L, "Policy One", PolicyStatus.ACTIVE, LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);

        when(insurancePolicyRepository.findById(1L)).thenReturn(Optional.of(mockedPolicy));
        InsurancePolicy policy = insurancePolicyService.getInsurancePolicyById(1L);

        assertNotNull(policy);
        assertEquals("Policy One", policy.getName());
        assertEquals(PolicyStatus.ACTIVE, policy.getStatus());
    }

    @Test
    void updateInsurancePolicy() throws InsurancePolicyValidationException {
        Long policyId = 1L;
        InsurancePolicyDao existingPolicyDao = new InsurancePolicyDao(1L, "Policy One", PolicyStatus.ACTIVE, LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);
        InsurancePolicyDto insurancePolicyDto = new InsurancePolicyDto(null, "Policy One", "ACTIVE", LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);

        when(insurancePolicyRepository.findById(policyId)).thenReturn(Optional.of(existingPolicyDao));
        when(insurancePolicyRepository.saveAndFlush(any(InsurancePolicyDao.class))).thenAnswer(i -> i.getArgument(0));

        InsurancePolicy updatedPolicy = insurancePolicyService.updateInsurancePolicy(policyId, insurancePolicyDto);

        assertNotNull(updatedPolicy);
        assertEquals(insurancePolicyDto.name(), updatedPolicy.getName());
        // Add more assertions as needed

        verify(insurancePolicyRepository).findById(policyId);
        verify(insurancePolicyRepository).saveAndFlush(any(InsurancePolicyDao.class));
    }

    @Test
    void deleteInsurancePolicy() {
        Long policyIdToDelete = 1L;
        InsurancePolicyDao mockedPolicy = new InsurancePolicyDao(policyIdToDelete, "Policy One", PolicyStatus.ACTIVE, LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);

        when(insurancePolicyRepository.findById(policyIdToDelete)).thenReturn(Optional.of(mockedPolicy));
        doNothing().when(insurancePolicyRepository).delete(mockedPolicy);

        InsurancePolicy deletedPolicy = insurancePolicyService.deleteInsurancePolicy(policyIdToDelete);

        assertNotNull(deletedPolicy);
        assertEquals("Policy One", deletedPolicy.getName());
        assertEquals(PolicyStatus.ACTIVE, deletedPolicy.getStatus());
        verify(insurancePolicyRepository, times(1)).delete(mockedPolicy);
    }
}

