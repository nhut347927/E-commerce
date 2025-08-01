package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Cart;
/**
 * Author: nhutnm379
 */
public interface CartJpa extends JpaRepository<Cart, Long> {
    
}
