package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.BrandAllDto;
import com.moe.socialnetwork.api.dtos.BrandCreateDto;
import com.moe.socialnetwork.api.dtos.BrandUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

public interface IBrandService {
        PageDto<BrandAllDto> getBrandAll(String query, int page, int Brand, String sort);

    BrandAllDto createBrand(User user, BrandCreateDto BrandCreateDto);

    BrandAllDto updateBrand(User user, BrandUpdateDto BrandUpdateDto);

    void deleteBrand(User user, CodeDto codeDto);
}
