package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class ProductVersionUpdateDto {

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Size name is required")
    @Size(max = 50, message = "Size name must not exceed 50 characters")
    private String name;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be 1 or greater")
    private Integer quantity;

    @NotBlank(message = "Image URL is required")
    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String image;

    @NotBlank(message = "Size code is required")
    @Size(max = 50, message = "Size code must not exceed 50 characters")
    private String sizeCode;

    @NotBlank(message = "Color code is required")
    @Size(max = 50, message = "Color code must not exceed 50 characters")
    private String colorCode;

    @NotBlank(message = "Product code is required")
    @Size(max = 50, message = "Product code must not exceed 50 characters")
    private String productCode;
}
