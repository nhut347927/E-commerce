package com.moe.ecommerce.api.dtos;

import java.math.BigDecimal;
import java.util.List;

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

     private String shortDescription;
    private String fullDescription;

    private List<VersionDto> listVersion;
    private String category;
private List<String> tags;
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VersionDto {
        private String code;
        private String image;
        private String stock;
        private String color;
        private String size;
    }

}
