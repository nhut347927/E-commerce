package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.BlogAllDto;
import com.moe.ecommerce.api.dtos.BlogCreateDto;
import com.moe.ecommerce.api.dtos.BlogUpdateDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;

public interface IBlogService {

    BlogAllDto getBlog(CodeDto codeDto);

    PageDto<BlogAllDto> getBlogAll(String query, int page, int Blog, String sort);

    BlogAllDto createBlog(User user, BlogCreateDto BlogCreateDto);

    BlogAllDto updateBlog(User user, BlogUpdateDto BlogUpdateDto);

    void deleteBlog(User user, CodeDto codeDto);
}
