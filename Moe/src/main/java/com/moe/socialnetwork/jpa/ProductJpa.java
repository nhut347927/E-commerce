package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Product;
/**
 * Author: nhutnm379
 */
public interface ProductJpa extends JpaRepository<Product, Long> {
       @Query("""
                SELECT p FROM Product p
                WHERE p.isDeleted = false
                  AND (:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Product> searchByName(@Param("query") String query, Pageable pageable);

    @Query(" SELECT p FROM Product p WHERE p.isDeleted = false AND p.code = :code")
    Optional<Product> findByCode(@Param("code") UUID code);
}
