package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.*;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

import java.time.LocalDateTime;

public interface IDiscountService {

    PageDto<DiscountAllDto> getDiscountAll(String query, int page, int size, String sort);

    DiscountAllDto createDiscountCo(User user, DiscountCreateCoDto dto);

    DiscountAllDto updateDiscountCo(User user, DiscountUpdateCoDto dto);

    DiscountAllDto createDiscountPro(User user, DiscountCreateProDto dto);

    DiscountAllDto updateDiscountPro(User user, DiscountUpdateProDto dto);

    void deleteDiscount(User user, CodeDto codeDto);

    void validateDates(LocalDateTime startDate, LocalDateTime endDate);
}
