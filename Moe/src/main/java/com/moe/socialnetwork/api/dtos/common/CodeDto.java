package com.moe.socialnetwork.api.dtos.common;

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
public class CodeDto {
    @NotBlank(message = "Code must not be blank.")
    private String code;
}
