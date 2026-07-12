package com.shankar.microfinance.authservice.service.impl;

import com.shankar.microfinance.authservice.dto.request.LoginRequest;
import com.shankar.microfinance.authservice.dto.request.RegisterRequest;
import com.shankar.microfinance.authservice.dto.response.LoginResponse;
import com.shankar.microfinance.authservice.dto.response.RegisterResponse;
import com.shankar.microfinance.authservice.dto.response.UserProfileResponse;
import com.shankar.microfinance.authservice.entity.Role;
import com.shankar.microfinance.authservice.entity.RoleName;
import com.shankar.microfinance.authservice.entity.User;
import com.shankar.microfinance.authservice.exception.DuplicateResourceException;
import com.shankar.microfinance.authservice.exception.ResourceNotFoundException;
import com.shankar.microfinance.authservice.repository.RoleRepository;
import com.shankar.microfinance.authservice.repository.UserRepository;
import com.shankar.microfinance.authservice.security.CustomUserDetails;
import com.shankar.microfinance.authservice.security.JwtService;
import com.shankar.microfinance.authservice.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private  final PasswordEncoder passwordEncoder;
    private  final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserServiceImpl(UserRepository userRepository,RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtService jwtService){
        this.userRepository=userRepository;
        this.roleRepository=roleRepository;
        this.passwordEncoder=passwordEncoder;
        this.authenticationManager=authenticationManager;
        this.jwtService=jwtService;
    }

    @Override
    public RegisterResponse register(RegisterRequest request){
        if(userRepository.existsByUsername(request.getUsername())){
            throw new DuplicateResourceException("User Name already Exists");
        }
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(("Email already Exists"));
        }
        Role customerRole=roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                .orElseThrow(() -> new ResourceNotFoundException("Default role ROLE_CUSTOMER not found"));
        User user=new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user.getRoles().add(customerRole);
        User savedUser=userRepository.save(user);
        RegisterResponse response=new RegisterResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setMessage("User Registered Successfully");
        return response;
    }

    @Override
    public LoginResponse login(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        User user=userRepository.findByUsername(request.getUsername())
                .orElseThrow(()-> new UsernameNotFoundException("User not Found"));
        String jwtToken= jwtService.generateToken(user);
        return new LoginResponse(jwtToken);

    }

    @Override
    public UserProfileResponse getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        List<String> roles = user.getRoles()
                .stream()
                .map(role -> role.getName().name())
                .toList();

        return new UserProfileResponse(
                user.getUsername(),
                user.getEmail(),
                roles
        );
    }
}
