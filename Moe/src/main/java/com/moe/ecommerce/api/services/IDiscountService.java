package com.moe.ecommerce.api.services;

import java.time.LocalDateTime;

import com.moe.ecommerce.api.dtos.*;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;

public interface IDiscountService {
    DiscountAllDto validDiscount(CodeDto dto);

    PageDto<DiscountAllDto> getDiscountAll(String query, int page, int size, String sort);

    DiscountAllDto createDiscountCo(User user, DiscountCreateCoDto dto);

    DiscountAllDto updateDiscountCo(User user, DiscountUpdateCoDto dto);

    DiscountAllDto createDiscountPro(User user, DiscountCreateProDto dto);

    DiscountAllDto updateDiscountPro(User user, DiscountUpdateProDto dto);

    void deleteDiscount(User user, CodeDto codeDto);

    void validateDates(LocalDateTime startDate, LocalDateTime endDate);
}
