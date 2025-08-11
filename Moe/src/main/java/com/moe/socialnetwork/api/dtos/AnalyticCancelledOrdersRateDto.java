package com.moe.socialnetwork.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticCancelledOrdersRateDto {
    private long totalOrders;     // Tổng số đơn hàng
    private long cancelledOrders; // Số đơn hàng bị hủy
    private double cancelRate;    // Tỉ lệ hủy đơn (%)
}
