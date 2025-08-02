package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColorUpdateDto {

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Color code is required")
    @Size(max = 50, message = "Color code must not exceed 50 characters")
    @Pattern(regexp = "^#?[A-Fa-f0-9]{6}$", message = "Color code must be a valid 6-digit hex value, with or without leading #")
    private String name;

}
