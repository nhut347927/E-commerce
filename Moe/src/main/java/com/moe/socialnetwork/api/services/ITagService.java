package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.TagAllDto;
import com.moe.socialnetwork.api.dtos.TagCreateDto;
import com.moe.socialnetwork.api.dtos.TagUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

public interface ITagService {
        PageDto<TagAllDto> getTagAll(String query, int page, int Tag, String sort);

    TagAllDto createTag(User user, TagCreateDto TagCreateDto);

    TagAllDto updateTag(User user, TagUpdateDto TagUpdateDto);

    void deleteTag(User user, CodeDto codeDto);
}
