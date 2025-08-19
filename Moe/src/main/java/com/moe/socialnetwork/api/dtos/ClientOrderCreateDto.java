package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientOrderCreateDto {

    @NotBlank(message = "First name must not be blank")
    private String firstName;

    @NotBlank(message = "Last name must not be blank")
    private String lastName;

    @NotBlank(message = "Country must not be blank")
    private String country;

    @NotBlank(message = "Address must not be blank")
    private String address;

    @NotBlank(message = "City must not be blank")
    private String city;
    @NotBlank(message = "City must not be blank")
    private String state; // Optional

    @NotBlank(message = "Phone must not be blank")
    @Pattern(regexp = "^(\\+84|0)\\d{9,10}$", message = "Phone number is invalid")
    private String phone;

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email is invalid")
    private String email;

    private String notes; // Optional

    private String discountCode; // Optional
}
