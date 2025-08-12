package com.moe.socialnetwork.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticTopSellingProductsDto {

    // Top 5 sản phẩm theo doanh thu
    private List<ProductSalesDto> topByRevenue;

    // Top 5 sản phẩm theo số lượng bán
    private List<ProductSalesDto> topByQuantity;
}
