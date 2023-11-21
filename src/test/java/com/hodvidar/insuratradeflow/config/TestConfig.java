package com.hodvidar.insuratradeflow.config;

import com.hodvidar.insuratradeflow.business.mapper.InsurancePolicyMapper;
import com.hodvidar.insuratradeflow.business.mapper.InsurancePolicyMapperImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestConfig {

    @Bean
    public InsurancePolicyMapper insurancePolicyMapper() {
        return new InsurancePolicyMapperImpl();
    }
}
