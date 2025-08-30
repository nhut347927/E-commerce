package com.moe.ecommerce.api.dtos;

import com.moe.ecommerce.models.Order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticOrdersByStatusDto {
    private Order.DeliveryStatus status; // enum DeliveryStatus
    private long totalOrders;
}
