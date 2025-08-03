package com.moe.socialnetwork.api.dtos;

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
public class ProductAllDto {
    private String code;
    private String name;

    private BigDecimal price;
    private String image;
    private String shortDescription;
    private String fullDescription;
    private String categoryCode;
    private String brandCode;
    private List<String> listTagCode;

    private String createAt;
    private String userCreateCode;
    private String userCreateDisplayName;
    private String updateAt;
    private String userUpdateCode;
    private String userUpdateDisplayName;

}
