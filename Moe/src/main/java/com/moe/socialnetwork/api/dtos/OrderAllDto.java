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
public class OrderAllDto {
    private String code;

    private int quantity;
    private BigDecimal price;
    private BigDecimal discountAmount;
    private BigDecimal shippingFee;

    private BigDecimal total;

    private String firstName;
    private String lastName;
    private String country;
    private String address;
    private String townCity;
    private String phone;
    private String email;
    private String notes;
    private String paymentMethod;

    private String reason; // lí do khi hủy

    private String discount;
    private String deliveryStatus;

    private String createAt;
    private String userCreateCode;
    private String userCreateDisplayName;
    private String updateAt;
    private String userUpdateCode;
    private String userUpdateDisplayName;
}
