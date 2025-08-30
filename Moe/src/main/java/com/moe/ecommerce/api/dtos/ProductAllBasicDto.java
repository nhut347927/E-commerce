package com.moe.ecommerce.api.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAllBasicDto {
    private String code;
    private String name;
    private String image;
    private BigDecimal price;
    private BigDecimal discountPrice;
}
