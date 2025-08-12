package com.moe.socialnetwork.api.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.AnalyticCancelledOrdersRateDto;
import com.moe.socialnetwork.api.dtos.AnalyticGrossProfitDto;
import com.moe.socialnetwork.api.dtos.AnalyticLowStockProductsDto;
import com.moe.socialnetwork.api.dtos.AnalyticNewCustomersOverTimeDto;
import com.moe.socialnetwork.api.dtos.AnalyticOrdersByStatusDto;
import com.moe.socialnetwork.api.dtos.AnalyticOrdersPerDayDto;
import com.moe.socialnetwork.api.dtos.AnalyticRevenueOverTimeDto;
import com.moe.socialnetwork.api.dtos.AnalyticTopSellingProductsDto;
import com.moe.socialnetwork.api.dtos.AnalyticTotalCustomersDto;
import com.moe.socialnetwork.api.dtos.ProductSalesDto;
import com.moe.socialnetwork.api.dtos.common.DateTimeDto;
import com.moe.socialnetwork.api.dtos.common.LimitDto;
import com.moe.socialnetwork.api.services.IAnalyticService;
import com.moe.socialnetwork.jpa.OrderItemJpa;
import com.moe.socialnetwork.jpa.OrderJpa;
import com.moe.socialnetwork.jpa.ProductVersionJpa;
import com.moe.socialnetwork.jpa.UserJpa;
import com.moe.socialnetwork.models.Order;
import com.moe.socialnetwork.models.ProductVersion;
import com.moe.socialnetwork.models.User;

@Service
public class AnalyticServiceImpl implements IAnalyticService {
    private final OrderJpa orderJpa;
    private final ProductVersionJpa productVersionJpa;
    private final UserJpa userJpa;
    private final OrderItemJpa orderItemJpa;

    public AnalyticServiceImpl(OrderJpa orderJpa, ProductVersionJpa productVersionJpa, UserJpa userJpa,
            OrderItemJpa orderItemJpa) {
        this.orderJpa = orderJpa;
        this.productVersionJpa = productVersionJpa;
        this.userJpa = userJpa;
        this.orderItemJpa = orderItemJpa;
    }

    public AnalyticCancelledOrdersRateDto getAnalyticCancelledOrdersRate(DateTimeDto dateTimeDto) {
        List<Order> orders = orderJpa.findOrdersFromStartDate(dateTimeDto.getStartDate());

        long totalOrders = orders.size();

        long cancelledOrders = orders.stream()
                .filter(o -> o.getDeliveryStatus() == Order.DeliveryStatus.CANCELED)
                .count();

        double cancelRate = 0;
        if (totalOrders > 0) {
            cancelRate = ((double) cancelledOrders / totalOrders) * 100;
        }

        AnalyticCancelledOrdersRateDto result = new AnalyticCancelledOrdersRateDto();
        result.setTotalOrders(totalOrders);
        result.setCancelledOrders(cancelledOrders);
        result.setCancelRate(cancelRate);

        return result;
    }

    public AnalyticGrossProfitDto getAnalyticGrossProfit(DateTimeDto dateTimeDto) {
        List<Order> orders = orderJpa.findOrdersFromStartDate(dateTimeDto.getStartDate());

        BigDecimal totalGrossProfit = orders.stream()
                .map(order -> order.getTotal() != null ? order.getTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AnalyticGrossProfitDto(totalGrossProfit);
    }

    public List<AnalyticLowStockProductsDto> getAnalyticLowStockProducts(LimitDto limitDto) {
        int limit = (limitDto != null && limitDto.getLimit() != null) ? limitDto.getLimit().intValue() : 10;
        PageRequest pageable = PageRequest.of(0, limit);

        List<ProductVersion> lowStockProductVersions = productVersionJpa.findLowStockProductVersions(pageable);

        return lowStockProductVersions.stream()
                .map(pv -> new AnalyticLowStockProductsDto(
                        pv.getProduct().getCode().toString(),
                        pv.getImage(),
                        pv.getProduct().getName() + "(" + pv.getName() + ")",
                        pv.getQuantity()))
                .collect(Collectors.toList());
    }

    public AnalyticNewCustomersOverTimeDto getAnalyticNewCustomersOverTime(DateTimeDto dateTimeDto) {
        List<User> users = userJpa.findUsersFromStartDate(dateTimeDto.getStartDate());
        return new AnalyticNewCustomersOverTimeDto(users.size());
    }

    public List<AnalyticOrdersByStatusDto> getAnalyticOrdersByStatus(DateTimeDto dateTimeDto) {
        LocalDateTime startDate = dateTimeDto.getStartDate();
        return orderJpa.countOrdersGroupByStatus(startDate);
    }

    public AnalyticOrdersPerDayDto getAnalyticOrdersPerDay(DateTimeDto dateTimeDto) {
        long count = orderJpa.countOrdersFromStartDate(dateTimeDto.getStartDate());
        return new AnalyticOrdersPerDayDto(count);
    }

    public List<AnalyticRevenueOverTimeDto> getAnalyticRevenueOverTime(DateTimeDto dateTimeDto) {
        return orderJpa.countRevenueGroupedByDate(dateTimeDto.getStartDate());
    }

    public AnalyticTopSellingProductsDto getAnalyticTopSellingProducts(LimitDto limitDto) {
        int limit = limitDto.getLimit() != null ? limitDto.getLimit().intValue() : 10;
        PageRequest pageable = PageRequest.of(0, limit);

        List<ProductSalesDto> topByRevenue = orderItemJpa.findTopByRevenue(pageable);
        List<ProductSalesDto> topByQuantity = orderItemJpa.findTopByQuantity(pageable);

        return new AnalyticTopSellingProductsDto(topByRevenue, topByQuantity);
    }

    public AnalyticTotalCustomersDto getAnalyticTotalCustomers() {
        long totalCustomers = userJpa.countByIsDeletedFalse();
        long purchasingCustomers = orderJpa.countDistinctUserCreateByIsDeletedFalse();

        double conversionRate = 0.0;
        if (totalCustomers > 0) {
            conversionRate = ((double) purchasingCustomers / totalCustomers) * 100;
        }

        return new AnalyticTotalCustomersDto(
                String.valueOf(purchasingCustomers),
                String.valueOf(totalCustomers),
                conversionRate);
    }

}
