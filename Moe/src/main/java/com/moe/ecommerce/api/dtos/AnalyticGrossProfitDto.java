package com.moe.ecommerce.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticGrossProfitDto {       // Ngày thống kê
    private BigDecimal grossProfit;   // Lợi nhuận gộp
}
