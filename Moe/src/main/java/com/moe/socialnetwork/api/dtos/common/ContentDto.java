package com.moe.socialnetwork.api.dtos.common;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContentDto {
    @NotBlank(message = "Content must not be blank")
    private String content;
}
