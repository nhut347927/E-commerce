package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Product;
/**
 * Author: nhutnm379
 */
public interface ProductJpa extends JpaRepository<Product, Long> {
    
}
