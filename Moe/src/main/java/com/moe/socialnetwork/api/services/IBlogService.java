package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.BlogAllDto;
import com.moe.socialnetwork.api.dtos.BlogCreateDto;
import com.moe.socialnetwork.api.dtos.BlogUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

public interface IBlogService {

    BlogAllDto getBlog(CodeDto codeDto);

    PageDto<BlogAllDto> getBlogAll(String query, int page, int Blog, String sort);

    BlogAllDto createBlog(User user, BlogCreateDto BlogCreateDto);

    BlogAllDto updateBlog(User user, BlogUpdateDto BlogUpdateDto);

    void deleteBlog(User user, CodeDto codeDto);
}
