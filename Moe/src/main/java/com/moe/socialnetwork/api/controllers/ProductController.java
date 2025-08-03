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

import com.moe.socialnetwork.api.dtos.BrandAllDto;
import com.moe.socialnetwork.api.dtos.CategoryAllDto;
import com.moe.socialnetwork.api.dtos.ProductAllDto;
import com.moe.socialnetwork.api.dtos.ProductCreateDto;
import com.moe.socialnetwork.api.dtos.ProductUpdateDto;
import com.moe.socialnetwork.api.dtos.TagAllDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IProductService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/product")
public class ProductController {
    private final IProductService productService;

    public ProductController(IProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/brand/all")
    public ResponseEntity<ResponseAPI<List<BrandAllDto>>> getAllBrand() {

        List<BrandAllDto> data = productService.getBrandAll();

        ResponseAPI<List<BrandAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/all")
    public ResponseEntity<ResponseAPI<List<CategoryAllDto>>> getAllCategory() {

        List<CategoryAllDto> data = productService.getCategoryAll();

        ResponseAPI<List<CategoryAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

     @GetMapping("/tag/all")
    public ResponseEntity<ResponseAPI<List<TagAllDto>>> getAllTag() {

        List<TagAllDto> data = productService.getTagAll();

        ResponseAPI<List<TagAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<ProductAllDto>> getProduct(
            @Valid @ModelAttribute CodeDto request,
            @AuthenticationPrincipal User user) {

        ProductAllDto data = productService.getProduct(
                request);

        ResponseAPI<ProductAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseAPI<PageDto<ProductAllDto>>> getAllProduct(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<ProductAllDto> data = productService.getProductAll(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<ProductAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<ProductAllDto>> createProduct(
            @Valid @RequestBody ProductCreateDto request,
            @AuthenticationPrincipal User user) {

        ProductAllDto data = productService.createProduct(
                user, request);

        ResponseAPI<ProductAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseAPI<ProductAllDto>> updateProduct(
            @Valid @RequestBody ProductUpdateDto request,
            @AuthenticationPrincipal User user) {

        ProductAllDto data = productService.updateProduct(
                user, request);

        ResponseAPI<ProductAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deleteProduct(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        productService.deleteProduct(user,
                request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
