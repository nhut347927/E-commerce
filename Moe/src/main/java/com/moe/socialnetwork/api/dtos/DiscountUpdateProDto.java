package com.moe.socialnetwork.api.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountUpdateProDto {

    @NotBlank(message = "Code is required")
    private String code;
    
    @NotBlank(message = "Discount type must not be blank")
    @Pattern(regexp = "^(PRODUCT|CODE)$", message = "Discount type must be either 'PRODUCT' or 'CODE'")
    private String discountType;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    @NotNull(message = "Discount value must not be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Discount value must be greater than 0")
    @DecimalMax(value = "50.0", message = "Discount value must not exceed 50%")
    private BigDecimal discountValue;

    @NotNull(message = "Discount max must not be null")
    @DecimalMin(value = "0.0", message = "Maximum discount must be greater than or equal to 0")
    private BigDecimal maxDiscount;

    @NotNull(message = "Start date must not be null")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @NotNull(message = "Status must not be null")
    private Boolean isActive;

    @NotBlank(message = "Product code must not be blank")
    private String productCode;

}
