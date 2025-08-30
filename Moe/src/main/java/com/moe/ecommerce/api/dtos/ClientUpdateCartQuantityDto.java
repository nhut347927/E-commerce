package com.moe.ecommerce.api.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientUpdateCartQuantityDto {
    @NotNull(message = "Product version code is required")
    private String code;

    @Min(value = 1, message = "Quantity must be greater than 0")
    private int quantity;
}
