package com.moe.ecommerce.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSalesDto {
    private String productCode;
    private String image;
    private String productName;
    private String revenue; // tổng doanh thu từ sản phẩm
    private Long quantitySold; // tổng số lượng đã bán

}
