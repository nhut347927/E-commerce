package com.moe.socialnetwork.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.moe.socialnetwork.api.dtos.ClientProductDto;
import com.moe.socialnetwork.api.dtos.ClientProductFilterDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IWishListService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/wishlist")
public class WishListController {

    private final IWishListService wishListService;

    public WishListController(IWishListService wishListService) {
        this.wishListService = wishListService;
    }

       @GetMapping("/all")
    public ResponseEntity<ResponseAPI<PageDto<ClientProductDto>>> getAllProductBasic(
            @Valid @ModelAttribute ClientProductFilterDto request,
            @AuthenticationPrincipal User user) {

        PageDto<ClientProductDto> data = wishListService.getWishListProductAll(
                user, request);

        ResponseAPI<PageDto<ClientProductDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/toggle")
    public ResponseEntity<ResponseAPI<String>> addToWishList(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        wishListService.toggleWishList(user, request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
