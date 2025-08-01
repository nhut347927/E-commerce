package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
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
public class TagCreateDto {
    @NotBlank(message = "Size name is required")
    @Size(max = 50, message = "Size name must not exceed 50 characters")
    private String name;
}
