package com.moe.socialnetwork.jpa;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.api.dtos.AnalyticOrdersByStatusDto;
import com.moe.socialnetwork.api.dtos.AnalyticRevenueOverTimeDto;
import com.moe.socialnetwork.models.Order;

/**
 * Author: nhutnm379
 */
public interface OrderJpa extends JpaRepository<Order, Long> {
  @Query("""
          SELECT o FROM Order o
          WHERE o.isDeleted = false
            AND (
              :query IS NULL OR :query = ''
              OR LOWER(o.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.country) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.address) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.townCity) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.phone) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.email) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.notes) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.paymentMethod) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(CAST(o.deliveryStatus AS string)) LIKE LOWER(CONCAT('%', :query, '%'))
            )
      """)
  Page<Order> searchByName(@Param("query") String query, Pageable pageable);

  @Query(" SELECT o FROM Order o WHERE o.isDeleted = false AND o.code = :code")
  Optional<Order> findByCode(@Param("code") UUID code);

  // ######################################################################
  @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt <= CURRENT_TIMESTAMP")
  List<Order> findOrdersFromStartDate(@Param("startDate") LocalDateTime startDate);

  @Query("SELECT new com.moe.socialnetwork.api.dtos.AnalyticOrdersByStatusDto(o.deliveryStatus, COUNT(o)) " +
      "FROM Order o " +
      "WHERE o.createdAt >= :startDate AND o.isDeleted = false " +
      "GROUP BY o.deliveryStatus")
  List<AnalyticOrdersByStatusDto> countOrdersGroupByStatus(@Param("startDate") LocalDateTime startDate);

  @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate AND o.isDeleted = false")
  long countOrdersFromStartDate(@Param("startDate") LocalDateTime startDate);

  @Query("SELECT new com.moe.socialnetwork.api.dtos.AnalyticRevenueOverTimeDto(" +
      "cast(FUNCTION('DATE', o.createdAt) as date), COUNT(o)) " +
      "FROM Order o " +
      "WHERE o.createdAt >= :startDate AND o.isDeleted = false " +
      "GROUP BY cast(FUNCTION('DATE', o.createdAt) as date) " +
      "ORDER BY cast(FUNCTION('DATE', o.createdAt) as date)")
  List<AnalyticRevenueOverTimeDto> countRevenueGroupedByDate(@Param("startDate") LocalDateTime startDate);

  @Query("SELECT COUNT(DISTINCT o.userCreate.id) FROM Order o WHERE o.isDeleted = false")
  long countDistinctUserCreateByIsDeletedFalse();


  @Query("""
          SELECT o FROM Order o
          WHERE o.isDeleted = false
            AND o.userCreate.id = :userId
            AND (
              :query IS NULL OR :query = ''
              OR LOWER(o.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.country) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.address) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.townCity) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.phone) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.email) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.notes) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(o.paymentMethod) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(CAST(o.deliveryStatus AS string)) LIKE LOWER(CONCAT('%', :query, '%'))
            )
      """)
  Page<Order> searchByNameAndUserId(@Param("userId") Long userId, @Param("query") String query, Pageable pageable);
}
