package com.moe.socialnetwork.api.services;

import java.util.List;

import com.moe.socialnetwork.api.dtos.AnalyticCancelledOrdersRateDto;
import com.moe.socialnetwork.api.dtos.AnalyticGrossProfitDto;
import com.moe.socialnetwork.api.dtos.AnalyticLowStockProductsDto;
import com.moe.socialnetwork.api.dtos.AnalyticNewCustomersOverTimeDto;
import com.moe.socialnetwork.api.dtos.AnalyticOrdersByStatusDto;
import com.moe.socialnetwork.api.dtos.AnalyticOrdersPerDayDto;
import com.moe.socialnetwork.api.dtos.AnalyticRevenueOverTimeDto;
import com.moe.socialnetwork.api.dtos.AnalyticTopSellingProductsDto;
import com.moe.socialnetwork.api.dtos.AnalyticTotalCustomersDto;
import com.moe.socialnetwork.api.dtos.common.DateTimeDto;
import com.moe.socialnetwork.api.dtos.common.LimitDto;

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
