package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Setting;

/**
 * Author: nhutnm379
 */
public interface SettingJpa extends JpaRepository<Setting, Long> {
    @Query("""
                SELECT s FROM Setting s
                WHERE  (:query IS NULL OR :query = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Setting> searchByName(@Param("query") String query, Pageable pageable);

    @Query(" SELECT s FROM Setting s WHERE s.code = :code")
    Optional<Setting> findByCode(@Param("code") UUID code);
}
