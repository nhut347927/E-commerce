package com.moe.socialnetwork.api.dtos;

import com.moe.socialnetwork.models.Order;

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
