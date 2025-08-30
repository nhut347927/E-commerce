package com.moe.ecommerce.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.ecommerce.api.dtos.UsersDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.FilterPageDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.api.services.IUserService;
import com.moe.ecommerce.models.User;
import com.moe.ecommerce.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseAPI<String>> getMe(
            @AuthenticationPrincipal User user) {
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(user!=null?user.getUsername():null);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<PageDto<UsersDto>>> getUserComments(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<UsersDto> data = userService.searchUsers(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<UsersDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deleteUser(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        userService.deleteUser(user,
                request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
