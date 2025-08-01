package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.CategoryAllDto;
import com.moe.socialnetwork.api.dtos.CategoryCreateDto;
import com.moe.socialnetwork.api.dtos.CategoryUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

public interface ICategoryService {
        PageDto<CategoryAllDto> getCategoryAll(String query, int page, int Category, String sort);

    CategoryAllDto createCategory(User user, CategoryCreateDto CategoryCreateDto);

    CategoryAllDto updateCategory(User user, CategoryUpdateDto CategoryUpdateDto);

    void deleteCategory(User user, CodeDto codeDto);
}
