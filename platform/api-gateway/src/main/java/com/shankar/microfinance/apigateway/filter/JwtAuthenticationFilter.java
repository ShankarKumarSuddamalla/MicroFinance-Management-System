package com.shankar.microfinance.apigateway.filter;

import com.shankar.microfinance.apigateway.security.JwtService;
import com.shankar.microfinance.apigateway.util.RouteValidator;
import io.jsonwebtoken.JwtException;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter
        implements WebFilter, Ordered {

    private final RouteValidator routeValidator;

    private final JwtService jwtService;

    public JwtAuthenticationFilter(RouteValidator routeValidator,
                                   JwtService jwtService) {

        this.routeValidator = routeValidator;
        this.jwtService = jwtService;

    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             WebFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();

        if (!routeValidator.isSecured.test(
                request.getURI().getPath())) {

            return chain.filter(exchange);

        }

        if (!request.getHeaders()
                .containsKey(HttpHeaders.AUTHORIZATION)) {

            exchange.getResponse()
                    .setStatusCode(HttpStatus.UNAUTHORIZED);

            return exchange.getResponse().setComplete();

        }

        String authHeader =
                request.getHeaders()
                        .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            exchange.getResponse()
                    .setStatusCode(HttpStatus.UNAUTHORIZED);

            return exchange.getResponse().setComplete();

        }

        String token =
                authHeader.substring(7);



        try {

            if (!jwtService.isTokenValid(token)) {

                exchange.getResponse()
                        .setStatusCode(HttpStatus.UNAUTHORIZED);

                return exchange.getResponse().setComplete();

            }

            Long userId = jwtService.extractUserId(token);

            String username = jwtService.extractUsername(token);

            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-Auth-User-Id", String.valueOf(userId))
                    .header("X-Auth-Username", username)
                    .build();

            return chain.filter(
                    exchange.mutate()
                            .request(mutatedRequest)
                            .build()
            );

        }
        catch (JwtException ex) {

            exchange.getResponse()
                    .setStatusCode(HttpStatus.UNAUTHORIZED);

            return exchange.getResponse().setComplete();

        }

    }

    @Override
    public int getOrder() {

        return -1;

    }

}