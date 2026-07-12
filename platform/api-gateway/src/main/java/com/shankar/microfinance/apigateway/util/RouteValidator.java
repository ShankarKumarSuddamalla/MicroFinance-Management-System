package com.shankar.microfinance.apigateway.util;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(

            "/api/auth/register",

            "/api/auth/login",

            "/actuator",

            "/v3/api-docs",

            "/swagger-ui",

            "/swagger-ui.html"

    );

    public Predicate<String> isSecured =

            uri -> openApiEndpoints
                    .stream()
                    .noneMatch(uri::startsWith);

}