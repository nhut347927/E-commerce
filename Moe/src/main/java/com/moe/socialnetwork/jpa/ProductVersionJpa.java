package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.ProductVersion;
/**
 * Author: nhutnm379
 */
public interface ProductVersionJpa extends JpaRepository<ProductVersion, Long> {
    
}
