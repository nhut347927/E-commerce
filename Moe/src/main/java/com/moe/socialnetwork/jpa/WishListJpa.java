package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.WishList;
/**
 * Author: nhutnm379
 */
public interface WishListJpa extends JpaRepository<WishList, Long> {
    
}
