package com.hodvidar.insuratradeflow.eventsourcing.query;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DeletedInsurancePolicyDto(
        Long id,
        String name,
        String status,
        LocalDate startDate,
        LocalDate endDate,
        LocalDateTime creationDateTime,
        LocalDateTime updateDateTime,
        LocalDateTime deletionDateTime
) {}
