package com.moe.ecommerce.api.dtos.common;

import java.time.LocalDateTime;

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
public class DateTimeDto {
    @NotNull(message = "Start date must not be null")
    private LocalDateTime startDate;
}
