package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.SizeAllDto;
import com.moe.socialnetwork.api.dtos.SizeCreateDto;
import com.moe.socialnetwork.api.dtos.SizeUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

/**
 * Author: nhutnm379
 */
public interface ISizeService {
    PageDto<SizeAllDto> getSizeAll(String query, int page, int size, String sort);

    SizeAllDto createSize(User user, SizeCreateDto sizeCreateDto);

    SizeAllDto updateSize(User user, SizeUpdateDto sizeUpdateDto);

    void deleteSize(User user, CodeDto codeDto);
}
