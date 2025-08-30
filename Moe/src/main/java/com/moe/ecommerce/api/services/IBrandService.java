package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.BrandAllDto;
import com.moe.ecommerce.api.dtos.BrandCreateDto;
import com.moe.ecommerce.api.dtos.BrandUpdateDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;

public interface IBrandService {
        PageDto<BrandAllDto> getBrandAll(String query, int page, int Brand, String sort);

    BrandAllDto createBrand(User user, BrandCreateDto BrandCreateDto);

    BrandAllDto updateBrand(User user, BrandUpdateDto BrandUpdateDto);

    void deleteBrand(User user, CodeDto codeDto);
}
