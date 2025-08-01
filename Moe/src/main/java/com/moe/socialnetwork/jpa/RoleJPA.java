package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Role;
/**
 * Author: nhutnm379
 */
public interface RoleJpa extends JpaRepository<Role, Long> {

}
