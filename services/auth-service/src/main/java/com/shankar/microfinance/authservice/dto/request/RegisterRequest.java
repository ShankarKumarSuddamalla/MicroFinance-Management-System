package com.shankar.microfinance.authservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = "UserName is required")
    @Size(min = 3,max = 100)
    private String username;

    @NotBlank(message = "Email is Required")
    @Email(message = "Invalid Email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 0,max = 20)
    private String password;


    public @NotBlank(message = "UserName is required") @Size(min = 3, max = 100) String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank(message = "UserName is required") @Size(min = 3, max = 100) String username) {
        this.username = username;
    }

    public @NotBlank(message = "Password is required") @Size(min = 0, max = 20) String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password is required") @Size(min = 0, max = 20) String password) {
        this.password = password;
    }

    public @NotBlank(message = "Email is Required") @Email(message = "Invalid Email") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email is Required") @Email(message = "Invalid Email") String email) {
        this.email = email;
    }

    public RegisterRequest(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public RegisterRequest() {
    }
}
