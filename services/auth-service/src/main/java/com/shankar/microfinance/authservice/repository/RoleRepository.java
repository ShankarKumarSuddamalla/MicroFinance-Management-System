package com.shankar.microfinance.authservice.repository;

import com.shankar.microfinance.authservice.entity.Role;
import com.shankar.microfinance.authservice.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByName(RoleName name);
}
