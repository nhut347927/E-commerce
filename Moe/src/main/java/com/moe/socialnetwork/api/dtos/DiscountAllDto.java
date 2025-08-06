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
public class DiscountAllDto {
    private String code;

    private String discountCode;
    private String discountType; //PRODUCT, CODE
    private String description;
    private BigDecimal discountValue;   //max 50%
    private BigDecimal maxDiscount;
    private String startDate;
    private String endDate;
	private Boolean isActive;
    private int usageLimit;
    private String productCode;
    private String productName;

    private String createAt;
    private String userCreateCode;
    private String userCreateDisplayName;
    private String updateAt;
    private String userUpdateCode;
    private String userUpdateDisplayName;
}
