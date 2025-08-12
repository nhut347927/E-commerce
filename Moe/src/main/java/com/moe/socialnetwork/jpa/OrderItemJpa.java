package com.moe.socialnetwork.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.api.dtos.ProductSalesDto;
import com.moe.socialnetwork.models.OrderItem;

/**
 * Author: nhutnm379
 */
public interface OrderItemJpa extends JpaRepository<OrderItem, Long> {
    @Query(" SELECT o FROM OrderItem o WHERE o.order.code = :orderCode")
    List<OrderItem> findByOrderCode(@Param("orderCode") UUID orderCode);

    @Query(" SELECT o FROM OrderItem o WHERE o.code = :orderItemCode")
    Optional<OrderItem> findByCode(@Param("orderItemCode") UUID orderItemCode);

    @Query(" SELECT o FROM OrderItem o WHERE o.order.id = :orderId AND o.productVersion.id = :productVersionId")
    Optional<OrderItem> findByOrderIdAndProductId(@Param("orderId") Long orderIdm,
            @Param("productVersionId") Long productVersionId);

    // ##########################################################################
    @Query("SELECT new com.moe.socialnetwork.api.dtos.ProductSalesDto(" +
            "CAST(pv.code AS string), " + // productCode
            "CAST(pv.image AS string), " + // image
            "CAST(pv.product.name AS string), " + // productName
            "CAST(SUM(oi.price * oi.quantity) AS string), " + // revenue
            "CAST(SUM(oi.quantity) AS long)) " + // quantitySold
            "FROM OrderItem oi " +
            "JOIN oi.productVersion pv " +
            "GROUP BY pv.code, pv.image, pv.product.name " +
            "ORDER BY SUM(oi.price * oi.quantity) DESC")
    List<ProductSalesDto> findTopByRevenue(Pageable pageable);

    @Query("SELECT new com.moe.socialnetwork.api.dtos.ProductSalesDto(" +
            "CAST(pv.code AS string), " +
            "CAST(pv.image AS string), " +
            "CAST(pv.product.name AS string), " +
            "CAST(SUM(oi.price * oi.quantity) AS string), " +
            "CAST(SUM(oi.quantity) AS long)) " +
            "FROM OrderItem oi " +
            "JOIN oi.productVersion pv " +
            "GROUP BY pv.code, pv.image, pv.product.name " +
            "ORDER BY SUM(oi.quantity) DESC")
    List<ProductSalesDto> findTopByQuantity(Pageable pageable);

}
