package com.moe.socialnetwork.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Cart;
import com.moe.socialnetwork.models.ProductVersion;

/**
 * Author: nhutnm379
 */
public interface CartJpa extends JpaRepository<Cart, Long> {

       @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
                     "FROM Cart c " +
                     "WHERE c.userCreate.id = :userId AND c.productVersion.id = :productVersionId")
       boolean existsByUserIdAndProductVersionId(
                     @Param("userId") Long userId,
                     @Param("productVersionId") Long productVersionId);

       @Query("SELECT c FROM Cart c " +
                     "WHERE c.userCreate.code = :userCode AND c.productVersion.code = :productVersionCode")
       Optional<Cart> findByUserCodeAndProductVersionCode(
                     @Param("userCode") UUID userCode,
                     @Param("productVersionCode") UUID productVersionCode);

       @Query("SELECT pv FROM Cart c JOIN c.productVersion pv " +
                     "WHERE c.userCreate.id = :userId")
       List<ProductVersion> findProductVersionsByUserId(
                     @Param("userId") Long userId);

       @Query("SELECT c FROM Cart c " +
                     "WHERE c.userCreate.id = :userId")
       List<Cart> findCartByUserId(
                     @Param("userId") Long userId);

}
