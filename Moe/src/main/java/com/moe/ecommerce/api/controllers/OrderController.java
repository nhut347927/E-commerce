package com.moe.ecommerce.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.moe.ecommerce.api.dtos.OrderAllDto;
import com.moe.ecommerce.api.dtos.OrderItemAddDto;
import com.moe.ecommerce.api.dtos.OrderItemAllDto;
import com.moe.ecommerce.api.dtos.OrderUpdateDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.FilterPageDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.api.services.IOrderService;
import com.moe.ecommerce.models.User;
import com.moe.ecommerce.response.ResponseAPI;

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

    @PostMapping("/client/cancel")
    public ResponseEntity<ResponseAPI<String>> cancelOrderClient(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        orderService.cancelOrder(user, request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response); 
    }

       @GetMapping("/client/all")
    public ResponseEntity<ResponseAPI<PageDto<OrderAllDto>>> getAllOrdersClient(
            @Valid @ModelAttribute FilterPageDto request
            , @AuthenticationPrincipal User user) {

        PageDto<OrderAllDto> data = orderService.getOrderAllClient(
                user,
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
    
    @GetMapping("/client/item/all")
    public ResponseEntity<ResponseAPI<List<OrderItemAllDto>>> getAllOrderItemsClient(
            @Valid @ModelAttribute CodeDto request) {

        List<OrderItemAllDto> data = orderService.getOrderItemByOrderCode(request);

        ResponseAPI<List<OrderItemAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
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
