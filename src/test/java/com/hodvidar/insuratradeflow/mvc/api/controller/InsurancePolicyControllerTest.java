package com.hodvidar.insuratradeflow.mvc.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hodvidar.insuratradeflow.mvc.api.controller.InsurancePolicyController;
import com.hodvidar.insuratradeflow.mvc.api.dto.InsurancePolicyDto;
import com.hodvidar.insuratradeflow.mvc.business.domain.InsurancePolicy;
import com.hodvidar.insuratradeflow.mvc.business.domain.PolicyStatus;
import com.hodvidar.insuratradeflow.mvc.business.service.InsurancePolicyService;
import com.hodvidar.insuratradeflow.mvc.api.config.TestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InsurancePolicyController.class)
@WithMockUser
@Import(TestConfig.class)
@ActiveProfiles("test")
class InsurancePolicyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InsurancePolicyService insurancePolicyService;

    @Test
    void createInsurancePolicyTest() throws Exception {
        InsurancePolicyDto policyToCreate = new InsurancePolicyDto(null, "New Policy", "ACTIVE", LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);
        InsurancePolicy createdPolicy = new InsurancePolicy(1L, "New Policy", PolicyStatus.ACTIVE, LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);

        when(insurancePolicyService.createInsurancePolicy(any(InsurancePolicyDto.class))).thenReturn(createdPolicy);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        String policyJson = objectMapper.writeValueAsString(policyToCreate);

        mockMvc.perform(post("/api/v1/insurance-policies")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(policyJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("New Policy"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.startDate").value("2023-01-01"))
                .andExpect(jsonPath("$.endDate").value("2024-01-01"));
    }

    @Test
    void getAllInsurancePolicies() throws Exception {
        // Create test data
        InsurancePolicy mockedPolicy1 = new InsurancePolicy(100L, "Policy One", PolicyStatus.ACTIVE,
                LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);
        InsurancePolicy mockedPolicy2 = new InsurancePolicy(200L, "Policy Two", PolicyStatus.INACTIVE,
                LocalDate.of(2023, 2, 1), LocalDate.of(2024, 2, 1), null, null);

        // Create a mock page
        Page<InsurancePolicy> mockPage = new PageImpl<>(
                List.of(mockedPolicy1, mockedPolicy2),
                PageRequest.of(0, 100, Sort.by("name").ascending()),
                2L
        );

        // Mock the service call
        when(insurancePolicyService.getAllInsurancePolicies(any(Pageable.class))).thenReturn(mockPage);

        // Perform the request with pagination parameters
        mockMvc.perform(get("/api/v1/insurance-policies")
                        .param("page", "0")
                        .param("size", "100")
                        .param("sort", "name,asc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

                // Verify pagination structure
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))

                // Verify first policy
                .andExpect(jsonPath("$.content[0].id").value(100))
                .andExpect(jsonPath("$.content[0].name").value("Policy One"))
                .andExpect(jsonPath("$.content[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$.content[0].startDate").value("2023-01-01"))
                .andExpect(jsonPath("$.content[0].endDate").value("2024-01-01"))

                // Verify second policy
                .andExpect(jsonPath("$.content[1].id").value(200))
                .andExpect(jsonPath("$.content[1].name").value("Policy Two"))
                .andExpect(jsonPath("$.content[1].status").value("INACTIVE"))
                .andExpect(jsonPath("$.content[1].startDate").value("2023-02-01"))
                .andExpect(jsonPath("$.content[1].endDate").value("2024-02-01"))

                // Verify pagination metadata
                .andExpect(jsonPath("$.pageable.pageNumber").value(0))
                .andExpect(jsonPath("$.pageable.pageSize").value(100))
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.totalPages").value(1))
                .andExpect(jsonPath("$.last").value(true))
                .andExpect(jsonPath("$.first").value(true))
                .andExpect(jsonPath("$.size").value(100))
                .andExpect(jsonPath("$.number").value(0))
                .andExpect(jsonPath("$.sort.sorted").value(true))
                .andExpect(jsonPath("$.sort.unsorted").value(false))
                .andExpect(jsonPath("$.sort.empty").value(false));
    }

    @Test
    void getInsurancePolicy() throws Exception {
        InsurancePolicy mockedPolicy = new InsurancePolicy(100L, "Policy One", PolicyStatus.ACTIVE, LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);

        when(insurancePolicyService.getInsurancePolicyById(100L)).thenReturn(mockedPolicy);

        mockMvc.perform(get("/api/v1/insurance-policies/100"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.name").value("Policy One"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.startDate").value("2023-01-01"))
                .andExpect(jsonPath("$.endDate").value("2024-01-01"));
    }

    @Test
    void updateInsurancePolicyTest() throws Exception {
        Long policyId = 1L;
        InsurancePolicyDto policyDto = new InsurancePolicyDto(null, "New Policy", "ACTIVE", LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);
        InsurancePolicy updatedPolicy = new InsurancePolicy(1L, "New Policy", PolicyStatus.ACTIVE, LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);

        when(insurancePolicyService.updateInsurancePolicy(eq(policyId), any(InsurancePolicyDto.class))).thenReturn(updatedPolicy);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        String policyJson = objectMapper.writeValueAsString(policyDto);

        mockMvc.perform(put("/api/v1/insurance-policies/" + policyId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(policyJson)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("New Policy"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.startDate").value("2023-01-01"))
                .andExpect(jsonPath("$.endDate").value("2024-01-01"));
    }

    @Test
    void deleteInsurancePolicyTest() throws Exception {
        Long policyIdToDelete = 100L;
        InsurancePolicy deletedPolicy = new InsurancePolicy(policyIdToDelete, "Policy One", PolicyStatus.ACTIVE, LocalDate.of(2023, 1, 1), LocalDate.of(2024, 1, 1), null, null);

        when(insurancePolicyService.deleteInsurancePolicy(policyIdToDelete)).thenReturn(deletedPolicy);

        mockMvc.perform(delete("/api/v1/insurance-policies/" + policyIdToDelete)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(policyIdToDelete))
                .andExpect(jsonPath("$.name").value("Policy One"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.startDate").value("2023-01-01"))
                .andExpect(jsonPath("$.endDate").value("2024-01-01"));
    }
}