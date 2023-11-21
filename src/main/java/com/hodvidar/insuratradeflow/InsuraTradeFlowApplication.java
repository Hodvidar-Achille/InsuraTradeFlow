package com.hodvidar.insuratradeflow;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@SpringBootApplication
public class InsuraTradeFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(InsuraTradeFlowApplication.class, args);
        log.warn("InsuraTradeFlow app run! " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy, HH:mm:ss")));
    }

}
