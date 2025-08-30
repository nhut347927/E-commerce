package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.SizeAllDto;
import com.moe.ecommerce.api.dtos.SizeCreateDto;
import com.moe.ecommerce.api.dtos.SizeUpdateDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;

/**
 * Author: nhutnm379
 */
public interface ISizeService {
    PageDto<SizeAllDto> getSizeAll(String query, int page, int size, String sort);

    SizeAllDto createSize(User user, SizeCreateDto sizeCreateDto);

    SizeAllDto updateSize(User user, SizeUpdateDto sizeUpdateDto);

    void deleteSize(User user, CodeDto codeDto);
}
