package com.moe.socialnetwork.api.controllers;

import com.moe.socialnetwork.api.dtos.*;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IDiscountService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discount")
public class DiscountController {

    private final IDiscountService discountService;

    public DiscountController(IDiscountService discountService) {
        this.discountService = discountService;
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseAPI<PageDto<DiscountAllDto>>> getAllDiscount(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<DiscountAllDto> data = discountService.getDiscountAll(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<DiscountAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/code")
    public ResponseEntity<ResponseAPI<DiscountAllDto>> createDiscountCode(
            @Valid @RequestBody DiscountCreateCoDto request,
            @AuthenticationPrincipal User user) {

        DiscountAllDto data = discountService.createDiscountCo(user, request);

        ResponseAPI<DiscountAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/code")
    public ResponseEntity<ResponseAPI<DiscountAllDto>> updateDiscountCode(
            @Valid @RequestBody DiscountUpdateCoDto request,
            @AuthenticationPrincipal User user) {

        DiscountAllDto data = discountService.updateDiscountCo(user, request);

        ResponseAPI<DiscountAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/product")
    public ResponseEntity<ResponseAPI<DiscountAllDto>> createDiscountProduct(
            @Valid @RequestBody DiscountCreateProDto request,
            @AuthenticationPrincipal User user) {

        DiscountAllDto data = discountService.createDiscountPro(user, request);

        ResponseAPI<DiscountAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/product")
    public ResponseEntity<ResponseAPI<DiscountAllDto>> updateDiscountProduct(
            @Valid @RequestBody DiscountUpdateProDto request,
            @AuthenticationPrincipal User user) {

        DiscountAllDto data = discountService.updateDiscountPro(user, request);

        ResponseAPI<DiscountAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deleteDiscount(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        discountService.deleteDiscount(user, request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
