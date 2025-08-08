package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemAddDto {

    @NotBlank(message = "orderCode is required")
    private String orderCode;

    @NotBlank(message = "productCode is required")
    private String productCode;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}