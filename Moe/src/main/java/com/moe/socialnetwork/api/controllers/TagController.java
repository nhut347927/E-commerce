package com.moe.socialnetwork.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.TagAllDto;
import com.moe.socialnetwork.api.dtos.TagCreateDto;
import com.moe.socialnetwork.api.dtos.TagUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.FilterPageDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.ITagService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/tag")
public class TagController {
    private final ITagService tagService;

    public TagController(ITagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<PageDto<TagAllDto>>> getAllTag(
            @Valid @ModelAttribute FilterPageDto request,
            @AuthenticationPrincipal User user) {

        PageDto<TagAllDto> data = tagService.getTagAll(
                request.getQ(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<PageDto<TagAllDto>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<TagAllDto>> createTag(
            @Valid @RequestBody TagCreateDto request,
            @AuthenticationPrincipal User user) {

        TagAllDto data = tagService.createTag(
                user, request);

        ResponseAPI<TagAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseAPI<TagAllDto>> updateTag(
            @Valid @RequestBody TagUpdateDto request,
            @AuthenticationPrincipal User user) {

        TagAllDto data = tagService.updateTag(
                user, request);

        ResponseAPI<TagAllDto> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deleteTag(
            @Valid @RequestBody CodeDto request,
            @AuthenticationPrincipal User user) {

        tagService.deleteTag(user,
                request);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }
}
