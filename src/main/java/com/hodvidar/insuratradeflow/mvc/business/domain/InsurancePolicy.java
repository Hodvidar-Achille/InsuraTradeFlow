package com.hodvidar.insuratradeflow.mvc.business.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor  // for tests
public class InsurancePolicy implements Serializable {
    private Long id;
    private String name;
    private PolicyStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime creationDateTime;
    private LocalDateTime updateDateTime;
}
