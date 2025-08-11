package com.hodvidar.insuratradeflow.mvc.business.mapper;

import com.hodvidar.insuratradeflow.mvc.api.dto.InsurancePolicyDto;
import com.hodvidar.insuratradeflow.mvc.business.domain.InsurancePolicy;
import com.hodvidar.insuratradeflow.mvc.persistance.dao.InsurancePolicyDao;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public interface InsurancePolicyMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDateTime", ignore = true)
    @Mapping(target = "updateDateTime", ignore = true)
    InsurancePolicy dtoToModel(InsurancePolicyDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDateTime", ignore = true)
    @Mapping(target = "updateDateTime", ignore = true)
    InsurancePolicyDao modelToEntity(InsurancePolicy model);
    InsurancePolicy entityToModel(InsurancePolicyDao entity);
    InsurancePolicyDto modelToDto(InsurancePolicy model);
}
