package com.hodvidar.insuratradeflow.eventsourcing.persistance.repository;

import com.hodvidar.insuratradeflow.eventsourcing.persistance.dao.DeletedPolicyDao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeletedPolicyRepository extends JpaRepository<DeletedPolicyDao, Long> {}
