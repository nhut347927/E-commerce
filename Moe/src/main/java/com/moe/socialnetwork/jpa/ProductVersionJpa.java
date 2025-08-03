package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.ProductVersion;

/**
 * Author: nhutnm379
 */
public interface ProductVersionJpa extends JpaRepository<ProductVersion, Long> {
    @Query("""
                SELECT p FROM ProductVersion p
                WHERE p.isDeleted = false
                  AND p.product.code = :productCode
                  AND (:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<ProductVersion> searchByName(@Param("query") String query, @Param("productCode") UUID productCode,
            Pageable pageable);

    @Query(" SELECT p FROM ProductVersion p WHERE p.isDeleted = false AND p.code = :code")
    Optional<ProductVersion> findByCode(@Param("code") UUID code);
}
