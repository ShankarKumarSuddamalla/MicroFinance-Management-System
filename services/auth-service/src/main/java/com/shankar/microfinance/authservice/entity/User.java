package com.shankar.microfinance.authservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity //Tells hibernate this class represents a database table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true,length = 100)
    private String username;

    @Column(nullable = false,unique = true,length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Boolean enabled=true;

    @Column(name = "created_at",nullable = false)
    private LocalDateTime created_at;

    @Column(name = "updated_at",nullable = false)
    private LocalDateTime updated_at;

    @PrePersist
    public void onCreate(){
        created_at=LocalDateTime.now();
        updated_at=LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate(){
        updated_at=LocalDateTime.now();
    }
}
