package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class SettingCreateDto {

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 100, message = "Name must be less than or equal to 100 characters")
    private String name;

    @NotBlank(message = "Data cannot be blank")
    private String data;

    @Size(max = 255, message = "Description must be less than or equal to 255 characters")
    private String description;

    @NotNull(message = "isActive must not be null")
    private Boolean isActive = true;
}
