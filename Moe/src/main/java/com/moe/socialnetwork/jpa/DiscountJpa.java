package com.moe.socialnetwork.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Discount;

/**
 * Author: nhutnm379
 */
public interface DiscountJpa extends JpaRepository<Discount, Long> {
  @Query("""
          SELECT d FROM Discount d
          WHERE d.isDeleted = false
            AND (:query IS NULL OR :query = '' OR LOWER(d.discountCode) LIKE LOWER(CONCAT('%', :query, '%'))OR LOWER(d.discountType) LIKE LOWER(CONCAT('%', :query, '%')) )
      """)
  Page<Discount> searchByName(@Param("query") String query, Pageable pageable);

  @Query("SELECT d FROM Discount d WHERE d.isDeleted = false AND d.code = :code")
  Optional<Discount> findByCode(@Param("code") UUID code);

  @Query("SELECT d FROM Discount d WHERE d.isDeleted = false AND d.product.code = :code AND (:discountCode IS NULL OR d.code != :discountCode)")
  List<Discount> findByProductCode(@Param("code") UUID code, @Param("discountCode") UUID discountCode);

}
