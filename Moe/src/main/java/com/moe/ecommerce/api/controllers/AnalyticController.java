package com.moe.ecommerce.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.moe.ecommerce.api.dtos.*;
import com.moe.ecommerce.api.dtos.common.DateTimeDto;
import com.moe.ecommerce.api.dtos.common.LimitDto;
import com.moe.ecommerce.api.services.IAnalyticService;
import com.moe.ecommerce.models.User;
import com.moe.ecommerce.response.ResponseAPI;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/analytic")
public class AnalyticController {

    private final IAnalyticService analyticService;

    public AnalyticController(IAnalyticService analyticService) {
        this.analyticService = analyticService;
    }

    @GetMapping("/cancelled-orders-rate")
    public ResponseEntity<ResponseAPI<AnalyticCancelledOrdersRateDto>> getCancelledOrdersRate(
            @Valid @ModelAttribute DateTimeDto dateTimeDto,
            @AuthenticationPrincipal User user) {

        AnalyticCancelledOrdersRateDto data = analyticService.getAnalyticCancelledOrdersRate(dateTimeDto);
        ResponseAPI<AnalyticCancelledOrdersRateDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/gross-profit")
    public ResponseEntity<ResponseAPI<AnalyticGrossProfitDto>> getGrossProfit(
            @Valid @ModelAttribute DateTimeDto dateTimeDto,
            @AuthenticationPrincipal User user) {

        AnalyticGrossProfitDto data = analyticService.getAnalyticGrossProfit(dateTimeDto);
        ResponseAPI<AnalyticGrossProfitDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/low-stock-products")
    public ResponseEntity<ResponseAPI<List<AnalyticLowStockProductsDto>>> getLowStockProducts(
            @Valid @ModelAttribute LimitDto limitDto,
            @AuthenticationPrincipal User user) {

        List<AnalyticLowStockProductsDto> data = analyticService.getAnalyticLowStockProducts(limitDto);
        ResponseAPI<List<AnalyticLowStockProductsDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/new-customers-over-time")
    public ResponseEntity<ResponseAPI<AnalyticNewCustomersOverTimeDto>> getNewCustomersOverTime(
            @Valid @ModelAttribute DateTimeDto dateTimeDto,
            @AuthenticationPrincipal User user) {

        AnalyticNewCustomersOverTimeDto data = analyticService.getAnalyticNewCustomersOverTime(dateTimeDto);
        ResponseAPI<AnalyticNewCustomersOverTimeDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders-by-status")
    public ResponseEntity<ResponseAPI<List<AnalyticOrdersByStatusDto>>> getOrdersByStatus(
            @Valid @ModelAttribute DateTimeDto dateTimeDto,
            @AuthenticationPrincipal User user) {

        List<AnalyticOrdersByStatusDto> data = analyticService.getAnalyticOrdersByStatus(dateTimeDto);
        ResponseAPI<List<AnalyticOrdersByStatusDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders-per-day")
    public ResponseEntity<ResponseAPI<AnalyticOrdersPerDayDto>> getOrdersPerDay(
            @Valid @ModelAttribute DateTimeDto dateTimeDto,
            @AuthenticationPrincipal User user) {

        AnalyticOrdersPerDayDto data = analyticService.getAnalyticOrdersPerDay(dateTimeDto);
        ResponseAPI<AnalyticOrdersPerDayDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/revenue-over-time")
    public ResponseEntity<ResponseAPI<List<AnalyticRevenueOverTimeDto>>> getRevenueOverTime(
            @Valid @ModelAttribute DateTimeDto dateTimeDto,
            @AuthenticationPrincipal User user) {

        List<AnalyticRevenueOverTimeDto> data = analyticService.getAnalyticRevenueOverTime(dateTimeDto);
        ResponseAPI<List<AnalyticRevenueOverTimeDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-selling-products")
    public ResponseEntity<ResponseAPI<AnalyticTopSellingProductsDto>> getTopSellingProducts(
            @Valid @ModelAttribute LimitDto limitDto,
            @AuthenticationPrincipal User user) {

        AnalyticTopSellingProductsDto data = analyticService.getAnalyticTopSellingProducts(limitDto);
        ResponseAPI<AnalyticTopSellingProductsDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/total-customers")
    public ResponseEntity<ResponseAPI<AnalyticTotalCustomersDto>> getTotalCustomers(
            @AuthenticationPrincipal User user) {

        AnalyticTotalCustomersDto data = analyticService.getAnalyticTotalCustomers();
        ResponseAPI<AnalyticTotalCustomersDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);
        return ResponseEntity.ok(response);
    }
}
