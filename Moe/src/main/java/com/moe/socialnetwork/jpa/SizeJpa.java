package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Size;

/**
 * Author: nhutnm379
 */
public interface SizeJpa extends JpaRepository<Size, Long> {
    @Query("""
                SELECT s FROM Size s
                WHERE s.isDeleted = false
                  AND (:query IS NULL OR :query = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Size> searchByName(@Param("query") String query, Pageable pageable);

    @Query(" SELECT s FROM Size s WHERE s.isDeleted = false AND s.code = :code")
    Optional<Size> findByCode(@Param("code") UUID code);

}
