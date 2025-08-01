package com.moe.socialnetwork.models;
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
@Table(name = "settings")
public class Setting  {
    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false, updatable = false)
	private UUID code;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(name = "data", columnDefinition = "TEXT", nullable = false)
    private String data;

	@Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

	@Column(name = "is_active", columnDefinition = "boolean default false")
	private Boolean isActive  = false;

	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_create", updatable = false)
	@JsonBackReference
	private User userCreate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_update")
	@JsonBackReference
	private User userUpdate;

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
