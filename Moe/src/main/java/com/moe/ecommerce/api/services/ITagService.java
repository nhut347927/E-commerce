package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.TagAllDto;
import com.moe.ecommerce.api.dtos.TagCreateDto;
import com.moe.ecommerce.api.dtos.TagUpdateDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;

public interface ITagService {
        PageDto<TagAllDto> getTagAll(String query, int page, int Tag, String sort);

    TagAllDto createTag(User user, TagCreateDto TagCreateDto);

    TagAllDto updateTag(User user, TagUpdateDto TagUpdateDto);

    void deleteTag(User user, CodeDto codeDto);
}
