package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.CategoryAllDto;
import com.moe.socialnetwork.api.dtos.CategoryCreateDto;
import com.moe.socialnetwork.api.dtos.CategoryUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.ICategoryService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.CategoryJpa;
import com.moe.socialnetwork.models.Category;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class CategoryServiceImpl implements ICategoryService {
    private final CategoryJpa categoryJpa;

    public CategoryServiceImpl(CategoryJpa categoryJpa) {
        this.categoryJpa = categoryJpa;
    }

    public PageDto<CategoryAllDto> getCategoryAll(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Category> categorys = categoryJpa.searchByName(query, pageable);

        List<CategoryAllDto> contents = categorys.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(categorys, contents);

    }

    public CategoryAllDto createCategory(User user, CategoryCreateDto categoryCreateDto) {
        try {
            Category category = new Category();
            category.setName(categoryCreateDto.getName());
            category.setUserCreate(user);
            category.setUserUpdate(user);
            categoryJpa.save(category);
            CategoryAllDto categoryAllDto = mapToDTO(category);
            return categoryAllDto;
        } catch (Exception e) {
            throw new AppException("An error occurred while creating Category: " + e.getMessage(), 500);
        }
    };

    public CategoryAllDto updateCategory(User user, CategoryUpdateDto categoryUpdateDto) {
        try {
            UUID categoryCode = UUID.fromString(categoryUpdateDto.getCode());
            Category category = categoryJpa.findByCode(categoryCode)
                    .orElseThrow(() -> new AppException("Category not found", HttpStatus.NOT_FOUND.value()));

            category.setName(categoryUpdateDto.getName());
            category.setUserUpdate(user);
            categoryJpa.save(category);
            CategoryAllDto categoryAllDto = mapToDTO(category);
            return categoryAllDto;
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Category code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating Category: " + e.getMessage(), 500);
        }
    };

    public void deleteCategory(User user, CodeDto codeDto) {
        try {
            UUID categoryCode = UUID.fromString(codeDto.getCode());
            Category category = categoryJpa.findByCode(categoryCode)
                    .orElseThrow(() -> new AppException("Category not found", HttpStatus.NOT_FOUND.value()));

            category.softDelete();
            category.setUserDelete(user);
            categoryJpa.save(category);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Category code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while delete Category: " + e.getMessage(), 500);
        }
    }

    private CategoryAllDto mapToDTO(Category category) {
        return new CategoryAllDto(category.getCode().toString(),
                category.getName(),
                category.getCreatedAt().toString(),
                category.getUserCreate().getCode().toString(),
                category.getUserCreate().getDisplayName(),
                category.getUpdatedAt().toString(),
                category.getUserUpdate().getCode().toString(),
                category.getUserUpdate().getDisplayName());
    }

}
