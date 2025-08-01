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
public class BlogCreateDto {

    @NotBlank(message = "Size title is required")
    @Size(max = 100, message = "Size title must not exceed 100 characters")
    private String title;

    @NotBlank(message = "Size title is required")
    @Size(max = 255, message = "Size title must not exceed 50 characters")
    private String image;

    @NotBlank(message = "Size description is required")
    private String description;
    
}
