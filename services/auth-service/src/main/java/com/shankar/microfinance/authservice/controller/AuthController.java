package com.shankar.microfinance.authservice.controller;

import com.shankar.microfinance.authservice.dto.request.LoginRequest;
import com.shankar.microfinance.authservice.dto.request.RegisterRequest;
import com.shankar.microfinance.authservice.dto.response.LoginResponse;
import com.shankar.microfinance.authservice.dto.response.RegisterResponse;
import com.shankar.microfinance.authservice.dto.response.UserProfileResponse;
import com.shankar.microfinance.authservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final UserService userService;
    public AuthController(UserService userService){
        this.userService=userService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        return ResponseEntity.ok(userService.login(request));
    }
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> currentUser() {

        return ResponseEntity.ok(
                userService.getCurrentUser()
        );

    }
}
