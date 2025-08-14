package com.moe.socialnetwork.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.moe.socialnetwork.api.dtos.ProductVersionAllDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.services.ICartService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final ICartService cartService;

    public CartController(ICartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseAPI<List<ProductVersionAllDto>>> getCartProductVersions(

            @AuthenticationPrincipal User user) {

        List<ProductVersionAllDto> data = cartService.getCartProductVersions(
                user);

        ResponseAPI<List<ProductVersionAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseAPI<String>> addToWishList(
            @Valid @RequestBody CodeDto request,
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
