package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Discount;
/**
 * Author: nhutnm379
 */
public interface DiscountJpa extends JpaRepository<Discount, Long> {
    
}
