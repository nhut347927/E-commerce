package com.moe.socialnetwork.api.controllers;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.BrandAllDto;
import com.moe.socialnetwork.api.dtos.BrandCreateDto;
import com.moe.socialnetwork.api.dtos.BrandUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IBrandService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/brand")
public class BrandController {
     private final IBrandService brandService;

    public BrandController(IBrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<PageDto<BrandAllDto>>> getAllBrand(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<BrandAllDto> data = brandService.getBrandAll(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<BrandAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<BrandAllDto>> createBrand(
            @Valid @RequestBody BrandCreateDto request,
            @AuthenticationPrincipal User user) {

        BrandAllDto data = brandService.createBrand(
                user, request);

        ResponseAPI<BrandAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseAPI<BrandAllDto>> updateBrand(
            @Valid @RequestBody BrandUpdateDto request,
            @AuthenticationPrincipal User user) {

        BrandAllDto data = brandService.updateBrand(
                user, request);

        ResponseAPI<BrandAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deleteBrand(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        brandService.deleteBrand(user,
                request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
