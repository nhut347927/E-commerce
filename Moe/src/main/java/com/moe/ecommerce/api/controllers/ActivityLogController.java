package com.moe.ecommerce.api.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.ecommerce.api.dtos.ActivityLogDto;
import com.moe.ecommerce.api.dtos.common.FilterPageDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.api.services.IActivityLogService;
import com.moe.ecommerce.auth.active.UserActivity;
import com.moe.ecommerce.auth.active.UserActivityContextService;
import com.moe.ecommerce.models.User;
import com.moe.ecommerce.response.ResponseAPI;

import jakarta.validation.Valid;
/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/logs")
public class ActivityLogController {
    private final IActivityLogService userActivityService;
    private final UserActivityContextService userActivityContextService;

    public ActivityLogController(
            IActivityLogService userActivityService,
            UserActivityContextService userActivityContextService) {
        this.userActivityService = userActivityService;
        this.userActivityContextService = userActivityContextService;
    }

    @GetMapping("/active-users")
    public ResponseEntity<ResponseAPI<PageDto<UserActivity>>> getActiveUsers(
            @Valid @ModelAttribute FilterPageDto request, @AuthenticationPrincipal User user) {
        PageDto<UserActivity> activeUsers = userActivityContextService.getActiveUsers(request.getQ(),
                request.getPage(), request.getSize());
        ResponseAPI<PageDto<UserActivity>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(activeUsers);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<PageDto<ActivityLogDto>>> getLog(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<ActivityLogDto> data = userActivityService.getLog(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<ActivityLogDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }
}
