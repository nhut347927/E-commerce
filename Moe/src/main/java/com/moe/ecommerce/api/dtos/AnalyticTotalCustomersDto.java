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
public class AnalyticTotalCustomersDto {

    private String purchasingCustomers; // khách hàng đã mua hàng
    private String totalCustomers; // tổng số khách hàng
    private double conversionRate; // tỉ lệ chuyển đổi %

}
