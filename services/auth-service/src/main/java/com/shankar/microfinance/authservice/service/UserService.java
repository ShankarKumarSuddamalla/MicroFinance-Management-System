package com.shankar.microfinance.authservice.service;

import com.shankar.microfinance.authservice.dto.request.LoginRequest;
import com.shankar.microfinance.authservice.dto.request.RegisterRequest;
import com.shankar.microfinance.authservice.dto.response.LoginResponse;
import com.shankar.microfinance.authservice.dto.response.RegisterResponse;
import com.shankar.microfinance.authservice.dto.response.UserProfileResponse;

public interface UserService {
    RegisterResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    UserProfileResponse getCurrentUser();
}
