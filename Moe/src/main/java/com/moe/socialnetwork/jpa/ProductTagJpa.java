package com.moe.socialnetwork.jpa;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.ProductTag;

/**
 * Author: nhutnm379
 */
public interface ProductTagJpa extends JpaRepository<ProductTag, Long> {
    @Query(" SELECT p FROM ProductTag p WHERE p.tag.isDeleted = false AND p.product.code = :productCode")
    List<ProductTag> findByProductCode(@Param("productCode") UUID productCode);
}
