package com.hodvidar.insuratradeflow.mvc.api.config;

import com.hodvidar.insuratradeflow.mvc.business.mapper.InsurancePolicyMapper;
import com.hodvidar.insuratradeflow.mvc.business.mapper.InsurancePolicyMapperImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestConfig {

    @Bean
    public InsurancePolicyMapper insurancePolicyMapper() {
        return new InsurancePolicyMapperImpl();
    }
}
