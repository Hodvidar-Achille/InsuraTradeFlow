package com.hodvidar.insuratradeflow.eventsourcing.persistance.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "deleted_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeletedPolicyDao {
    @Id
    private Long id;
    private String name;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime creationDateTime;
    private LocalDateTime updateDateTime;
    private LocalDateTime deletionDateTime;

    @PrePersist
    protected void onCreate() {
        deletionDateTime = LocalDateTime.now();
    }
}
