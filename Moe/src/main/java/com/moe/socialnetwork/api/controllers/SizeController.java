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

import com.moe.socialnetwork.api.dtos.SizeAllDto;
import com.moe.socialnetwork.api.dtos.SizeCreateDto;
import com.moe.socialnetwork.api.dtos.SizeUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.ISizeService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/size")
public class SizeController {
    private final ISizeService sizeService;

    public SizeController(ISizeService sizeService) {
        this.sizeService = sizeService;
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<PageDto<SizeAllDto>>> getAllSize(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<SizeAllDto> data = sizeService.getSizeAll(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<SizeAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<SizeAllDto>> createSize(
            @Valid @RequestBody SizeCreateDto request,
            @AuthenticationPrincipal User user) {

        SizeAllDto data = sizeService.createSize(
                user, request);

        ResponseAPI<SizeAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseAPI<SizeAllDto>> updateSize(
            @Valid @RequestBody SizeUpdateDto request,
            @AuthenticationPrincipal User user) {

        SizeAllDto data = sizeService.updateSize(
                user, request);

        ResponseAPI<SizeAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deleteSize(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        sizeService.deleteSize(user,
                request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
