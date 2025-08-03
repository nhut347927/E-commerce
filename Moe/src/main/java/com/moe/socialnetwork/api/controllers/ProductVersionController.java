package com.moe.socialnetwork.api.controllers;

import java.util.List;

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

import com.moe.socialnetwork.api.dtos.ColorAllDto;
import com.moe.socialnetwork.api.dtos.ProductVersionAllDto;
import com.moe.socialnetwork.api.dtos.ProductVersionCreateDto;
import com.moe.socialnetwork.api.dtos.ProductVersionUpdateDto;
import com.moe.socialnetwork.api.dtos.SizeAllDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IProductVersionService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/product-version")
public class ProductVersionController {
    private final IProductVersionService productVersionService;

    public ProductVersionController(IProductVersionService productVersionService) {
        this.productVersionService = productVersionService;
    }

    @GetMapping("/color/all")
    public ResponseEntity<ResponseAPI<List<ColorAllDto>>> getAllColor() {

        List<ColorAllDto> data = productVersionService.getColorAll();

        ResponseAPI<List<ColorAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/size/all")
    public ResponseEntity<ResponseAPI<List<SizeAllDto>>> getAllCategory() {

        List<SizeAllDto> data = productVersionService.getSizeAll();

        ResponseAPI<List<SizeAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseAPI<PageDto<ProductVersionAllDto>>> getAllProductVersion(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<ProductVersionAllDto> data = productVersionService.getProductVersionAll(
                request.getCode(),
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<ProductVersionAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<ProductVersionAllDto>> createProductVersion(
            @Valid @RequestBody ProductVersionCreateDto request,
            @AuthenticationPrincipal User user) {

        ProductVersionAllDto data = productVersionService.createProductVersion(
                user, request);

        ResponseAPI<ProductVersionAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseAPI<ProductVersionAllDto>> updateProductVersion(
            @Valid @RequestBody ProductVersionUpdateDto request,
            @AuthenticationPrincipal User user) {

        ProductVersionAllDto data = productVersionService.updateProductVersion(
                user, request);

        ResponseAPI<ProductVersionAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deleteProductVersion(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        productVersionService.deleteProductVersion(user,
                request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
