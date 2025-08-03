package com.moe.socialnetwork.api.dtos;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class ProductCreateDto {
    @NotBlank(message = "Size name is required")
    @Size(max = 50, message = "Size name must not exceed 50 characters")
    private String name;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "Image URL is required")
    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String image;

    @NotBlank(message = "Short description is required")
    @Size(max = 150, message = "Short description must not exceed 150 characters")
    private String shortDescription;

    @NotBlank(message = "Full description is required")
    @Size(max = 2000, message = "Full description must not exceed 1000 characters")
    private String fullDescription;

    @NotBlank(message = "Category code is required")
    @Size(max = 50, message = "Category code must not exceed 50 characters")
    private String categoryCode;

    @NotBlank(message = "Brand code is required")
    @Size(max = 50, message = "Brand code must not exceed 50 characters")
    private String brandCode;

    @NotEmpty(message = "List of tag codes is required")
    private List<String> listTagCode;
}
