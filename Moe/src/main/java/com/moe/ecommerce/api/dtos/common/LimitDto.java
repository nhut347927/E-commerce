package com.moe.ecommerce.api.dtos.common;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LimitDto {
    @NotNull(message = "Limit cannot be null")
    @Min(value = 1, message = "Limit must be greater than or equal to 1")
    private Long limit;

}
