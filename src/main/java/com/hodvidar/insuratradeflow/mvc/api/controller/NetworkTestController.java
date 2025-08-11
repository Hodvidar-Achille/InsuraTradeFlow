package com.hodvidar.insuratradeflow.mvc.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class NetworkTestController {

    @GetMapping("/greeting")
    public Map<String, String> getGreeting() {
        // White listed endpoint used for test (see WebSecurityConfig)
        return Collections.singletonMap("message", "Hello from Spring Boot!");
    }
    @GetMapping("/network-test")
    public ResponseEntity<String> networkTest() {
        // Non-white listed endpoint used for test
        return ResponseEntity.ok("Network connection successful");
    }
}