package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.CategoryAllDto;
import com.moe.ecommerce.api.dtos.CategoryCreateDto;
import com.moe.ecommerce.api.dtos.CategoryUpdateDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;

public interface ICategoryService {
        PageDto<CategoryAllDto> getCategoryAll(String query, int page, int Category, String sort);

    CategoryAllDto createCategory(User user, CategoryCreateDto CategoryCreateDto);

    CategoryAllDto updateCategory(User user, CategoryUpdateDto CategoryUpdateDto);

    void deleteCategory(User user, CodeDto codeDto);
}
