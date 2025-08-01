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

import com.moe.socialnetwork.api.dtos.BlogAllDto;
import com.moe.socialnetwork.api.dtos.BlogCreateDto;
import com.moe.socialnetwork.api.dtos.BlogUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IBlogService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/blog")
public class BlogController {
    private final IBlogService blogService;

    public BlogController(IBlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<BlogAllDto>> getBlog(
            @Valid @ModelAttribute CodeDto request,
            @AuthenticationPrincipal User user) {

        BlogAllDto data = blogService.getBlog(
                request);

        ResponseAPI<BlogAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseAPI<PageDto<BlogAllDto>>> getAllBlog(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<BlogAllDto> data = blogService.getBlogAll(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<BlogAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<BlogAllDto>> createBlog(
            @Valid @RequestBody BlogCreateDto request,
            @AuthenticationPrincipal User user) {

        BlogAllDto data = blogService.createBlog(
                user, request);

        ResponseAPI<BlogAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseAPI<BlogAllDto>> updateBlog(
            @Valid @RequestBody BlogUpdateDto request,
            @AuthenticationPrincipal User user) {

        BlogAllDto data = blogService.updateBlog(
                user, request);

        ResponseAPI<BlogAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deleteBlog(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        blogService.deleteBlog(user,
                request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
