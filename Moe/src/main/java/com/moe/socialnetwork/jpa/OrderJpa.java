package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Order;
/**
 * Author: nhutnm379
 */
public interface OrderJpa extends JpaRepository<Order, Long> {
    
}
