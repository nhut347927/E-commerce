package com.moe.socialnetwork.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.OrderItem;

/**
 * Author: nhutnm379
 */
public interface OrderItemJpa extends JpaRepository<OrderItem, Long> {
    @Query(" SELECT o FROM OrderItem o WHERE o.order.code = :orderCode")
    List<OrderItem> findByOrderCode(@Param("orderCode") UUID orderCode);

    @Query(" SELECT o FROM OrderItem o WHERE o.code = :orderItemCode")
    Optional<OrderItem> findByCode(@Param("orderItemCode") UUID orderItemCode);

}
