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

import com.moe.socialnetwork.api.dtos.ColorAllDto;
import com.moe.socialnetwork.api.dtos.ColorCreateDto;
import com.moe.socialnetwork.api.dtos.ColorUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IColorService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/color")
public class ColorController {
    private final IColorService colorService;

    public ColorController(IColorService colorService) {
        this.colorService = colorService;
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<PageDto<ColorAllDto>>> getAllColor(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<ColorAllDto> data = colorService.getColorAll(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<ColorAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<ColorAllDto>> createColor(
            @Valid @RequestBody ColorCreateDto request,
            @AuthenticationPrincipal User user) {

        ColorAllDto data = colorService.createColor(
                user, request);

        ResponseAPI<ColorAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseAPI<ColorAllDto>> updateColor(
            @Valid @RequestBody ColorUpdateDto request,
            @AuthenticationPrincipal User user) {

        ColorAllDto data = colorService.updateColor(
                user, request);

        ResponseAPI<ColorAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deleteColor(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        colorService.deleteColor(user,
                request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    } 
}
