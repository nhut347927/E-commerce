package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Category;

/**
 * Author: nhutnm379
 */
public interface CategoryJpa extends JpaRepository<Category, Long> {
    @Query("""
                SELECT c FROM Category c
                WHERE c.isDeleted = false
                  AND (:query IS NULL OR :query = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Category> searchByName(@Param("query") String query, Pageable pageable);

    @Query(" SELECT c FROM Category c WHERE c.isDeleted = false AND c.code = :code")
    Optional<Category> findByCode(@Param("code") UUID code);
}
