package com.moe.socialnetwork.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.moe.socialnetwork.api.dtos.SettingAllDto;
import com.moe.socialnetwork.api.dtos.SettingCreateDto;
import com.moe.socialnetwork.api.dtos.SettingUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.ISettingService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/setting")
public class SettingController {

    private final ISettingService settingService;

    public SettingController(ISettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<PageDto<SettingAllDto>>> getAllSetting(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<SettingAllDto> data = settingService.getSettingAll(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<SettingAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get")
    public ResponseEntity<ResponseAPI<SettingAllDto>> getSetting(
            @Valid @ModelAttribute CodeDto request,
            @AuthenticationPrincipal User user) {

        SettingAllDto data = settingService.getSetting(request);

        ResponseAPI<SettingAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<SettingAllDto>> createSetting(
            @Valid @RequestBody SettingCreateDto request,
            @AuthenticationPrincipal User user) {

        SettingAllDto data = settingService.createSetting(user, request);

        ResponseAPI<SettingAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseAPI<SettingAllDto>> updateSetting(
            @Valid @RequestBody SettingUpdateDto request,
            @AuthenticationPrincipal User user) {

        SettingAllDto data = settingService.updateSetting(user, request);

        ResponseAPI<SettingAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/disable")
    public ResponseEntity<ResponseAPI<String>> disable(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        settingService.disableSetting(user,
                request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }

}
