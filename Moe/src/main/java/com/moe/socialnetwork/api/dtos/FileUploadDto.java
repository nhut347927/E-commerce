package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadDto {

    @NotBlank(message = "Base64 string must not be empty")
    private String base64;
}