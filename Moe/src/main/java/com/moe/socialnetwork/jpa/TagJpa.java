package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Tag;
/**
 * Author: nhutnm379
 */
public interface TagJpa extends JpaRepository<Tag, Long> {
    @Query("""
                SELECT t FROM Tag t
                WHERE t.isDeleted = false
                  AND (:query IS NULL OR :query = '' OR LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Tag> searchByName(@Param("query") String query, Pageable pageable);

    @Query(" SELECT t FROM Tag t WHERE t.isDeleted = false AND t.code = :code")
    Optional<Tag> findByCode(@Param("code") UUID code);
}
