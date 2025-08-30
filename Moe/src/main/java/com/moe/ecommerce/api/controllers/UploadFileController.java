package com.moe.ecommerce.api.controllers;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.moe.ecommerce.api.dtos.FileUploadDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.services.ICloudinaryService;
import com.moe.ecommerce.api.services.impl.CloudinaryServiceImpl;
import com.moe.ecommerce.response.ResponseAPI;

import java.io.IOException;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/files")
public class UploadFileController {

    private final ICloudinaryService cloudinaryService;

    public UploadFileController(CloudinaryServiceImpl cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload/images")
    public ResponseEntity<ResponseAPI<String>> uploadImage(
        @Valid @RequestBody FileUploadDto request
    ) throws IOException {
        String publicId = cloudinaryService.uploadImage(request.getBase64());
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(publicId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    public ResponseEntity<ResponseAPI<String>> deleteFile(
        @RequestBody CodeDto request
    ) throws IOException {
        boolean deleted = cloudinaryService.deleteFile(request.getCode());
        ResponseAPI<String> response = new ResponseAPI<>();
        if (deleted) {
            response.setCode(200);
            response.setMessage("Success");
        } else {
            response.setCode(400);
            response.setMessage("Failed to delete file");
        }
        return ResponseEntity.ok(response);
    }
}