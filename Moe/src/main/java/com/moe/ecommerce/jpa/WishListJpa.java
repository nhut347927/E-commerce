package com.moe.ecommerce.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.ecommerce.models.Product;
import com.moe.ecommerce.models.WishList;

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

    @Query("SELECT CASE WHEN COUNT(w) > 0 THEN true ELSE false END " +
            "FROM WishList w " +
            "WHERE w.user.id = :userId AND w.product.id = :productId")
    boolean existsByUserIdAndProductId(
            @Param("userId") Long userId,
            @Param("productId") Long productId);

    // Nếu muốn check bằng UUID code
    @Query("SELECT CASE WHEN COUNT(w) > 0 THEN true ELSE false END " +
            "FROM WishList w " +
            "WHERE w.user.code = :userCode AND w.product.code = :productCode")
    boolean existsByUserCodeAndProductCode(
            @Param("userCode") UUID userCode,
            @Param("productCode") UUID productCode);

    // Lấy wishlist theo user và product
    @Query("SELECT w FROM WishList w " +
            "WHERE w.user.code = :userCode AND w.product.code = :productCode")
    Optional<WishList> findByUserCodeAndProductCode(@Param("userCode") UUID userCode,
            @Param("productCode") UUID productCode);

    @Query("SELECT p FROM WishList w JOIN w.product p WHERE w.user.id = :userId")
    Page<Product> findProductsByUserId(@Param("userId") Long userId, Pageable pageable);

}
