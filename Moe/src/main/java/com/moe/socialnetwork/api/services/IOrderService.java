package com.moe.socialnetwork.api.services;

import java.util.List;

import com.moe.socialnetwork.api.dtos.OrderAllDto;
import com.moe.socialnetwork.api.dtos.OrderItemAddDto;
import com.moe.socialnetwork.api.dtos.OrderItemAllDto;
import com.moe.socialnetwork.api.dtos.OrderUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.Order;
import com.moe.socialnetwork.models.User;

public interface IOrderService {
    void cancelOrder(User user, CodeDto dto);

    List<OrderItemAllDto> getOrderItemByOrderCode(CodeDto dto);

    PageDto<OrderAllDto> getOrderAllClient(User user, String query, int page, int size, String sort);

    List<String> getDeliveryStatuses();

    PageDto<OrderAllDto> getOrderAll(String query, int page, int size, String sort);

    OrderAllDto updateOrder(User user, OrderUpdateDto orderUpdateDto);

    List<OrderItemAllDto> getAllOrderItem(CodeDto dto);

    void addOrderItem(User user, OrderItemAddDto orderItemAddDto);

    void deleteOrderItem(CodeDto dto);

    void recalculateOrderTotals(Order order);
}
