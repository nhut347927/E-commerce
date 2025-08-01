package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Color;

/**
 * Author: nhutnm379
 */
public interface ColorJpa extends JpaRepository<Color, Long> {
    @Query("""
                SELECT c FROM Color c
                WHERE c.isDeleted = false
                  AND (:query IS NULL OR :query = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Color> searchByName(@Param("query") String query, Pageable pageable);

    @Query(" SELECT c FROM Color c WHERE c.isDeleted = false AND c.code = :code")
    Optional<Color> findByCode(@Param("code") UUID code);
}
