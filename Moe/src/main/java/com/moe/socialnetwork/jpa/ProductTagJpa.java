package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.ProductTag;
/**
 * Author: nhutnm379
 */
public interface ProductTagJpa extends JpaRepository<ProductTag, Long> {
    
}
