package com.moe.socialnetwork.api.dtos;

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
public class OrderItemAllDto {
    private String code;

    private String productName;
    private String image;
    private int quantity;
    private BigDecimal price;

    private String createAt;
    private String userCreateCode;
    private String userCreateDisplayName;
}
