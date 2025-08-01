package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.BlogAllDto;
import com.moe.socialnetwork.api.dtos.BlogCreateDto;
import com.moe.socialnetwork.api.dtos.BlogUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IBlogService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.BlogJpa;
import com.moe.socialnetwork.models.Blog;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class BlogServiceImpl implements IBlogService {
    private final BlogJpa blogJpa;

    public BlogServiceImpl(BlogJpa blogJpa) {
        this.blogJpa = blogJpa;
    }

    public BlogAllDto getBlog(CodeDto codeDto) {

        UUID blogCode = UUID.fromString(codeDto.getCode());
        Blog blog = blogJpa.findByCode(blogCode)
                .orElseThrow(() -> new AppException("Blog not found", HttpStatus.NOT_FOUND.value()));

        return mapToDTO(blog);

    }

    public PageDto<BlogAllDto> getBlogAll(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Blog> blogs = blogJpa.searchByName(query, pageable);

        List<BlogAllDto> contents = blogs.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(blogs, contents);

    }

    public BlogAllDto createBlog(User user, BlogCreateDto blogCreateDto) {
        try {
            Blog blog = new Blog();
            blog.setTitle(blogCreateDto.getTitle());
            blog.setImage(blogCreateDto.getImage());
            blog.setDescription(blogCreateDto.getDescription());
            blog.setUserCreate(user);
            blog.setUserUpdate(user);
            blogJpa.save(blog);
            BlogAllDto blogAllDto = mapToDTO(blog);
            return blogAllDto;
        } catch (Exception e) {
            throw new AppException("An error occurred while creating Blog: " + e.getMessage(), 500);
        }
    };

    public BlogAllDto updateBlog(User user, BlogUpdateDto blogUpdateDto) {
        try {
            UUID blogCode = UUID.fromString(blogUpdateDto.getCode());
            Blog blog = blogJpa.findByCode(blogCode)
                    .orElseThrow(() -> new AppException("Blog not found", HttpStatus.NOT_FOUND.value()));

            blog.setTitle(blogUpdateDto.getTitle());
            blog.setImage(blogUpdateDto.getImage());
            blog.setDescription(blogUpdateDto.getDescription());
            blog.setUserUpdate(user);
            blogJpa.save(blog);
            BlogAllDto blogAllDto = mapToDTO(blog);
            return blogAllDto;
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Blog code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating Blog: " + e.getMessage(), 500);
        }
    };

    public void deleteBlog(User user, CodeDto codeDto) {
        try {
            UUID blogCode = UUID.fromString(codeDto.getCode());
            Blog blog = blogJpa.findByCode(blogCode)
                    .orElseThrow(() -> new AppException("Blog not found", HttpStatus.NOT_FOUND.value()));

            blog.softDelete();
            blog.setUserDelete(user);
            blogJpa.save(blog);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Blog code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while delete Blog: " + e.getMessage(), 500);
        }
    }

    private BlogAllDto mapToDTO(Blog blog) {
        return new BlogAllDto(blog.getCode().toString(),
                blog.getTitle(),
                blog.getImage(),
                blog.getDescription(),
                blog.getCreatedAt().toString(),
                blog.getUserCreate().getCode().toString(),
                blog.getUserCreate().getDisplayName(),
                blog.getUpdatedAt().toString(),
                blog.getUserUpdate().getCode().toString(),
                blog.getUserUpdate().getDisplayName());
    }
}
