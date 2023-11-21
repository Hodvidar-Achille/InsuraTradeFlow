package com.hodvidar.insuratradeflow.business.mapper;

import com.hodvidar.insuratradeflow.api.dto.InsurancePolicyDto;
import com.hodvidar.insuratradeflow.business.domain.InsurancePolicy;
import com.hodvidar.insuratradeflow.business.domain.PolicyStatus;
import com.hodvidar.insuratradeflow.persistance.dao.InsurancePolicyDao;
import java.time.LocalDate;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-11-21T16:29:37+0100",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class InsurancePolicyMapperImpl implements InsurancePolicyMapper {

    @Override
    public InsurancePolicy dtoToModel(InsurancePolicyDto dto) {
        if ( dto == null ) {
            return null;
        }

        String name = null;
        PolicyStatus status = null;
        LocalDate startDate = null;
        LocalDate endDate = null;

        name = dto.name();
        if ( dto.status() != null ) {
            status = Enum.valueOf( PolicyStatus.class, dto.status() );
        }
        startDate = dto.startDate();
        endDate = dto.endDate();

        Long id = null;
        LocalDateTime creationDateTime = null;
        LocalDateTime updateDateTime = null;

        InsurancePolicy insurancePolicy = new InsurancePolicy( id, name, status, startDate, endDate, creationDateTime, updateDateTime );

        return insurancePolicy;
    }

    @Override
    public InsurancePolicyDao modelToEntity(InsurancePolicy model) {
        if ( model == null ) {
            return null;
        }

        InsurancePolicyDao insurancePolicyDao = new InsurancePolicyDao();

        insurancePolicyDao.setName( model.getName() );
        insurancePolicyDao.setStatus( model.getStatus() );
        insurancePolicyDao.setStartDate( model.getStartDate() );
        insurancePolicyDao.setEndDate( model.getEndDate() );

        return insurancePolicyDao;
    }

    @Override
    public InsurancePolicy entityToModel(InsurancePolicyDao entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        String name = null;
        PolicyStatus status = null;
        LocalDate startDate = null;
        LocalDate endDate = null;
        LocalDateTime creationDateTime = null;
        LocalDateTime updateDateTime = null;

        id = entity.getId();
        name = entity.getName();
        status = entity.getStatus();
        startDate = entity.getStartDate();
        endDate = entity.getEndDate();
        creationDateTime = entity.getCreationDateTime();
        updateDateTime = entity.getUpdateDateTime();

        InsurancePolicy insurancePolicy = new InsurancePolicy( id, name, status, startDate, endDate, creationDateTime, updateDateTime );

        return insurancePolicy;
    }

    @Override
    public InsurancePolicyDto modelToDto(InsurancePolicy model) {
        if ( model == null ) {
            return null;
        }

        Long id = null;
        String name = null;
        String status = null;
        LocalDate startDate = null;
        LocalDate endDate = null;
        LocalDateTime creationDateTime = null;
        LocalDateTime updateDateTime = null;

        id = model.getId();
        name = model.getName();
        if ( model.getStatus() != null ) {
            status = model.getStatus().name();
        }
        startDate = model.getStartDate();
        endDate = model.getEndDate();
        creationDateTime = model.getCreationDateTime();
        updateDateTime = model.getUpdateDateTime();

        InsurancePolicyDto insurancePolicyDto = new InsurancePolicyDto( id, name, status, startDate, endDate, creationDateTime, updateDateTime );

        return insurancePolicyDto;
    }
}
