package com.hodvidar.insuratradeflow.mvc.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record InsurancePolicyDto(
        Long id,
        String name,
        String status, // ACTIVE or INACTIVE
        LocalDate startDate,
        LocalDate endDate,
        LocalDateTime creationDateTime,
        LocalDateTime updateDateTime
) {
}
