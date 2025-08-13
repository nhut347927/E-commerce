package com.moe.socialnetwork.jpa;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Rating;

/**
 * Author: nhutnm379
 */
public interface RatingJpa extends JpaRepository<Rating, Long> {
    @Query("""
            SELECT COALESCE(AVG(r.rating), 0.0)
            FROM Rating r
            JOIN r.product p
            WHERE p.code = :productCode
              AND r.isDeleted = false
              AND p.isDeleted = false
            """)
    Double getAverageRatingByProductCode(@Param("productCode") UUID productCode);
}
