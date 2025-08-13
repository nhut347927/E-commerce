package com.moe.socialnetwork.jpa;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.WishList;

/**
 * Author: nhutnm379
 */
public interface WishListJpa extends JpaRepository<WishList, Long> {
    @Query("""
            SELECT w FROM WishList w
            JOIN w.product p
            JOIN w.user u
            WHERE u.code = :userCode
              AND p.isDeleted = false
            """)
    List<WishList> findByUserCode(@Param("userCode") UUID userCode);
}
