package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Rating;
/**
 * Author: nhutnm379
 */
public interface RatingJpa extends JpaRepository<Rating, Long> {
    
}
