package com.moe.socialnetwork.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.moe.socialnetwork.api.dtos.OrderAllDto;
import com.moe.socialnetwork.api.dtos.OrderItemAddDto;
import com.moe.socialnetwork.api.dtos.OrderItemAllDto;
import com.moe.socialnetwork.api.dtos.OrderUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IOrderService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final IOrderService orderService;

    public OrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/delivery-status/all")
    public ResponseEntity<ResponseAPI<List<String>>> getAllDeliveryStatuses() {
        List<String> data = orderService.getDeliveryStatuses();

        ResponseAPI<List<String>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseAPI<PageDto<OrderAllDto>>> getAllOrders(
            @Valid @ModelAttribute FilterPageDto request) {

        PageDto<OrderAllDto> data = orderService.getOrderAll(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<OrderAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseAPI<OrderAllDto>> updateOrder(
            @Valid @RequestBody OrderUpdateDto request,
            @AuthenticationPrincipal User user) {

        OrderAllDto data = orderService.updateOrder(user, request);

        ResponseAPI<OrderAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/item/all")
    public ResponseEntity<ResponseAPI<List<OrderItemAllDto>>> getAllOrderItems(
            @Valid @ModelAttribute CodeDto request) {

        List<OrderItemAllDto> data = orderService.getAllOrderItem(request);

        ResponseAPI<List<OrderItemAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/item")
    public ResponseEntity<ResponseAPI<String>> addOrderItem(
            @Valid @RequestBody OrderItemAddDto request,
            @AuthenticationPrincipal User user) {

        orderService.addOrderItem(user, request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/item")
    public ResponseEntity<ResponseAPI<String>> deleteOrderItem(
            @Valid @RequestBody CodeDto request) {

        orderService.deleteOrderItem(request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
