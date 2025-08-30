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
public class ClientCartAllDto {
    private String code;
    private String name;

    private int quantity;
    private String image;
    private String size;
    private String color;
    private BigDecimal price;
}
