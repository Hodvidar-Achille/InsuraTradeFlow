package com.hodvidar.insuratradeflow.config;

import com.hodvidar.insuratradeflow.business.mapper.InsurancePolicyMapper;
import com.hodvidar.insuratradeflow.business.mapper.InsurancePolicyMapperImpl;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;

@Configuration
public class TestConfig {

    @MockBean
    private JwtDecoder jwtDecoder;
    @Bean
    public InsurancePolicyMapper insurancePolicyMapper() {
        return new InsurancePolicyMapperImpl();
    }
}
