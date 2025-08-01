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

import com.moe.socialnetwork.api.dtos.CategoryAllDto;
import com.moe.socialnetwork.api.dtos.CategoryCreateDto;
import com.moe.socialnetwork.api.dtos.CategoryUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.ICategoryService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/category")
public class CategoryController {
     private final ICategoryService categoryService;

    public CategoryController(ICategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<PageDto<CategoryAllDto>>> getAllCategory(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<CategoryAllDto> data = categoryService.getCategoryAll(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<CategoryAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<CategoryAllDto>> createCategory(
            @Valid @RequestBody CategoryCreateDto request,
            @AuthenticationPrincipal User user) {

        CategoryAllDto data = categoryService.createCategory(
                user, request);

        ResponseAPI<CategoryAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseAPI<CategoryAllDto>> updateCategory(
            @Valid @RequestBody CategoryUpdateDto request,
            @AuthenticationPrincipal User user) {

        CategoryAllDto data = categoryService.updateCategory(
                user, request);

        ResponseAPI<CategoryAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deleteCategory(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        categoryService.deleteCategory(user,
                request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
