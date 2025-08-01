package com.moe.socialnetwork.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "discounts")
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, updatable = false)
    private UUID code;

    @Column(nullable = false, length = 150)
    private String description;

    @Column(name = "discount_value", nullable = false)
    private BigDecimal discountValue;

    @Column(name = "max_discount", nullable = false)
    private BigDecimal maxDiscount;

    @Column(name = "start_date", updatable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "is_deleted", columnDefinition = "boolean default false")
    private Boolean isDeleted = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_create", updatable = false)
    @JsonBackReference
    private User userCreate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_update")
    @JsonBackReference
    private User userUpdate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_delete")
    @JsonBackReference
    private User userDelete;

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        this.isDeleted = true;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        this.code = UUID.randomUUID();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
