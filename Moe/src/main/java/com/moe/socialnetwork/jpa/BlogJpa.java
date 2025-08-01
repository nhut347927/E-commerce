package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Blog;

/**
 * Author: nhutnm379
 */
public interface BlogJpa extends JpaRepository<Blog, Long> {
    @Query("""
                SELECT b FROM Blog b
                WHERE b.isDeleted = false
                  AND (:query IS NULL OR :query = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Blog> searchByName(@Param("query") String query, Pageable pageable);

    @Query(" SELECT b FROM Blog b WHERE b.isDeleted = false AND b.code = :code")
    Optional<Blog> findByCode(@Param("code") UUID code);
}
