package com.moe.ecommerce.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.moe.ecommerce.api.dtos.ClientCartAllDto;
import com.moe.ecommerce.api.dtos.ClientCartDto;
import com.moe.ecommerce.api.dtos.ClientUpdateCartQuantityDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.services.ICartService;
import com.moe.ecommerce.models.User;
import com.moe.ecommerce.response.ResponseAPI;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final ICartService cartService;

    public CartController(ICartService cartService) {
        this.cartService = cartService;
    }

    @PutMapping("update-quantity")
    public ResponseEntity<ResponseAPI<String>> updateCartQuantity(
            @Valid @RequestBody ClientUpdateCartQuantityDto request,
            @AuthenticationPrincipal User user) {

        cartService.updateQuantity(user, request.getCode(), request.getQuantity());

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseAPI<List<ClientCartAllDto>>> getCartProductVersions(

            @AuthenticationPrincipal User user) {

        List<ClientCartAllDto> data = cartService.getCartProductVersions(
                user);

        ResponseAPI<List<ClientCartAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseAPI<String>> addToWishList(
            @Valid @RequestBody ClientCartDto request,
            @AuthenticationPrincipal User user) {

        cartService.addToCart(user, request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ResponseAPI<String>> deleteFromWishList(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        cartService.deleteFromCart(user, request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
