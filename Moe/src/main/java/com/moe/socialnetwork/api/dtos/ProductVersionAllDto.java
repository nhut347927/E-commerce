package com.moe.socialnetwork.api.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVersionAllDto {
    private String code;
    private String name;

    private int quantity;
    private String image;
    private String sizeCode;
    private String colorCode;
    private String productCode;

    private String createAt;
    private String userCreateCode;
    private String userCreateDisplayName;
    private String updateAt;
    private String userUpdateCode;
    private String userUpdateDisplayName;

}
