package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.TagAllDto;
import com.moe.socialnetwork.api.dtos.TagCreateDto;
import com.moe.socialnetwork.api.dtos.TagUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.ITagService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.TagJpa;
import com.moe.socialnetwork.models.Tag;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class TagServiceImpl implements ITagService {

    private final TagJpa tagJpa;

    public TagServiceImpl(TagJpa tagJpa) {
        this.tagJpa = tagJpa;
    }

    public PageDto<TagAllDto> getTagAll(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Tag> tags = tagJpa.searchByName(query, pageable);

        List<TagAllDto> contents = tags.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(tags, contents);

    }

    public TagAllDto createTag(User user, TagCreateDto tagCreateDto) {
        try {
            Tag tag = new Tag();
            tag.setName(tagCreateDto.getName());
            tag.setUserCreate(user);
            tag.setUserUpdate(user);
            tagJpa.save(tag);
            TagAllDto tagAllDto = mapToDTO(tag);
            return tagAllDto;
        } catch (Exception e) {
            throw new AppException("An error occurred while creating Tag: " + e.getMessage(), 500);
        }
    };

    public TagAllDto updateTag(User user, TagUpdateDto tagUpdateDto) {
        try {
            UUID tagCode = UUID.fromString(tagUpdateDto.getCode());
            Tag tag = tagJpa.findByCode(tagCode)
                    .orElseThrow(() -> new AppException("Tag not found", HttpStatus.NOT_FOUND.value()));

            tag.setName(tagUpdateDto.getName());
            tag.setUserUpdate(user);
            tagJpa.save(tag);
            TagAllDto tagAllDto = mapToDTO(tag);
            return tagAllDto;
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Tag code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating Tag: " + e.getMessage(), 500);
        }
    };

    public void deleteTag(User user, CodeDto codeDto) {
        try {
            UUID tagCode = UUID.fromString(codeDto.getCode());
            Tag tag = tagJpa.findByCode(tagCode)
                    .orElseThrow(() -> new AppException("Tag not found", HttpStatus.NOT_FOUND.value()));

            tag.softDelete();
            tag.setUserDelete(user);
            tagJpa.save(tag);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Tag code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while delete Tag: " + e.getMessage(), 500);
        }
    }

    private TagAllDto mapToDTO(Tag tag) {
        return new TagAllDto(tag.getCode().toString(),
                tag.getName(),
                tag.getCreatedAt().toString(),
                tag.getUserCreate().getCode().toString(),
                tag.getUserCreate().getDisplayName(),
                tag.getUpdatedAt().toString(),
                tag.getUserUpdate().getCode().toString(),
                tag.getUserUpdate().getDisplayName());
    }

}
