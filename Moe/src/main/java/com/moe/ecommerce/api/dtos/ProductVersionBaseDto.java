package com.moe.ecommerce.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVersionBaseDto {
    private String code;

    private String productName;
    
    private String size;
    private String color;
}
