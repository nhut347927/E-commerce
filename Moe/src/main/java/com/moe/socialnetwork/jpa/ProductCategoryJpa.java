package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.ProductCategory;
/**
 * Author: nhutnm379
 */
public interface ProductCategoryJpa extends JpaRepository<ProductCategory, Long> {
    
}
