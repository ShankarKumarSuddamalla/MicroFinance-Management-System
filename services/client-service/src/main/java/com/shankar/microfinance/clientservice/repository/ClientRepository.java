package com.shankar.microfinance.clientservice.repository;

import com.shankar.microfinance.clientservice.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByClientNumber(String clientNumber);

    Optional<Client> findByAuthUserId(Long authUserId);

    boolean existsByAadhaarNumber(String aadhaarNumber);

    boolean existsByPanNumber(String panNumber);

    Optional<Client> findByMobileNumber(String mobileNumber);
    Optional<Client> findByAadhaarNumber(String AadhaarNumber);
    Optional<Client> findByPanNumber(String panNumber);
    List<Client> findByFirstNameContainingIgnoreCase(String firstName);
}