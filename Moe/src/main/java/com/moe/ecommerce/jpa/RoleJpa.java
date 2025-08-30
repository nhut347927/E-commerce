package com.moe.ecommerce.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.ecommerce.models.Role;
/**
 * Author: nhutnm379
 */
public interface RoleJpa extends JpaRepository<Role, Long> {

}
