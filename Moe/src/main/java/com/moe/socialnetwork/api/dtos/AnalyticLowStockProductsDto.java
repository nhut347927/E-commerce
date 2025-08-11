package com.moe.socialnetwork.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticLowStockProductsDto {
    private String productCode;
    private String image;
    private String productName;
    private int stockQuantity;
}

