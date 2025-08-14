package com.moe.socialnetwork.api.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientProductDto {
    private String code;
    private String name;

    private BigDecimal price;
    private String image;
    private Boolean liked;
    private Double rating;

    private String colorOne;
    private String colorTwo;
    private String colorThree;

    private Boolean isDiscount;
    private String discountValue;
    private BigDecimal discountPrice; // giá sau khi giảm
}
