package com.moe.socialnetwork.jpa;

import java.math.BigDecimal;
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
      SELECT DISTINCT p FROM Product p
      LEFT JOIN p.category c
      LEFT JOIN p.brand b
      LEFT JOIN p.productVersions pv
      LEFT JOIN pv.size s
      LEFT JOIN pv.color col
      LEFT JOIN p.productTags pt
      LEFT JOIN pt.tag t
      WHERE p.isDeleted = false
        AND (:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
        AND (:categoryCode IS NULL OR c.code = :categoryCode AND c.isDeleted = false)
        AND (:brandCode IS NULL OR b.code = :brandCode AND b.isDeleted = false)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        AND (:sizeCode IS NULL OR s.code = :sizeCode AND s.isDeleted = false AND pv.isDeleted = false)
        AND (:colorCode IS NULL OR col.code = :colorCode AND col.isDeleted = false AND pv.isDeleted = false)
        AND (:tagCode IS NULL OR t.code = :tagCode AND t.isDeleted = false)
      """)
  Page<Product> filterProducts(
      @Param("query") String query,
      @Param("categoryCode") UUID categoryCode,
      @Param("brandCode") UUID brandCode,
      @Param("minPrice") BigDecimal minPrice,
      @Param("maxPrice") BigDecimal maxPrice,
      @Param("sizeCode") UUID sizeCode,
      @Param("colorCode") UUID colorCode,
      @Param("tagCode") UUID tagCode,
      Pageable pageable);

  // ########################################################################################
  @Query("""
          SELECT p FROM Product p
          WHERE p.isDeleted = false
            AND (:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
      """)
  Page<Product> searchByName(@Param("query") String query, Pageable pageable);

  @Query(" SELECT p FROM Product p WHERE p.isDeleted = false AND p.code = :code")
  Optional<Product> findByCode(@Param("code") UUID code);
}
