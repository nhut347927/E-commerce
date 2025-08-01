package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Brand;
/**
 * Author: nhutnm379
 */
public interface BrandJpa extends JpaRepository<Brand, Long> {
    @Query("""
                SELECT b FROM Brand b
                WHERE b.isDeleted = false
                  AND (:query IS NULL OR :query = '' OR LOWER(b.name) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Brand> searchByName(@Param("query") String query, Pageable pageable);

    @Query(" SELECT b FROM Brand b WHERE b.isDeleted = false AND b.code = :code")
    Optional<Brand> findByCode(@Param("code") UUID code);
}
