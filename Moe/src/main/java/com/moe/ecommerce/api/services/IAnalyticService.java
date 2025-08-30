package com.moe.ecommerce.api.services;

import java.util.List;

import com.moe.ecommerce.api.dtos.AnalyticCancelledOrdersRateDto;
import com.moe.ecommerce.api.dtos.AnalyticGrossProfitDto;
import com.moe.ecommerce.api.dtos.AnalyticLowStockProductsDto;
import com.moe.ecommerce.api.dtos.AnalyticNewCustomersOverTimeDto;
import com.moe.ecommerce.api.dtos.AnalyticOrdersByStatusDto;
import com.moe.ecommerce.api.dtos.AnalyticOrdersPerDayDto;
import com.moe.ecommerce.api.dtos.AnalyticRevenueOverTimeDto;
import com.moe.ecommerce.api.dtos.AnalyticTopSellingProductsDto;
import com.moe.ecommerce.api.dtos.AnalyticTotalCustomersDto;
import com.moe.ecommerce.api.dtos.common.DateTimeDto;
import com.moe.ecommerce.api.dtos.common.LimitDto;

public interface IAnalyticService {

    AnalyticCancelledOrdersRateDto getAnalyticCancelledOrdersRate(DateTimeDto dateTimeDto);

    AnalyticGrossProfitDto getAnalyticGrossProfit(DateTimeDto dateTimeDto);

    List<AnalyticLowStockProductsDto> getAnalyticLowStockProducts(LimitDto limitDto);

    AnalyticNewCustomersOverTimeDto getAnalyticNewCustomersOverTime(DateTimeDto dateTimeDto);

    List<AnalyticOrdersByStatusDto> getAnalyticOrdersByStatus(DateTimeDto dateTimeDto);

    AnalyticOrdersPerDayDto getAnalyticOrdersPerDay(DateTimeDto dateTimeDto);

    List<AnalyticRevenueOverTimeDto> getAnalyticRevenueOverTime(DateTimeDto dateTimeDto);

    AnalyticTopSellingProductsDto getAnalyticTopSellingProducts(LimitDto limitDto);

    AnalyticTotalCustomersDto getAnalyticTotalCustomers();
}
