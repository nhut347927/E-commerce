package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.BrandAllDto;
import com.moe.socialnetwork.api.dtos.BrandCreateDto;
import com.moe.socialnetwork.api.dtos.BrandUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IBrandService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.BrandJpa;
import com.moe.socialnetwork.models.Brand;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class BrandServiceImpl implements IBrandService {
    private final BrandJpa brandJpa;

    public BrandServiceImpl(BrandJpa brandJpa) {
        this.brandJpa = brandJpa;
    }

    public PageDto<BrandAllDto> getBrandAll(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Brand> brands = brandJpa.searchByName(query, pageable);

        List<BrandAllDto> contents = brands.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(brands, contents);

    }

    public BrandAllDto createBrand(User user, BrandCreateDto brandCreateDto) {
        try {
            Brand brand = new Brand();
            brand.setName(brandCreateDto.getName());
            brand.setUserCreate(user);
            brand.setUserUpdate(user);
            brandJpa.save(brand);
            BrandAllDto brandAllDto = mapToDTO(brand);
            return brandAllDto;
        } catch (Exception e) {
            throw new AppException("An error occurred while creating Brand: " + e.getMessage(), 500);
        }
    };

    public BrandAllDto updateBrand(User user, BrandUpdateDto brandUpdateDto) {
        try {
            UUID brandCode = UUID.fromString(brandUpdateDto.getCode());
            Brand brand = brandJpa.findByCode(brandCode)
                    .orElseThrow(() -> new AppException("Brand not found", HttpStatus.NOT_FOUND.value()));

            brand.setName(brandUpdateDto.getName());
            brand.setUserUpdate(user);
            brandJpa.save(brand);
            BrandAllDto brandAllDto = mapToDTO(brand);
            return brandAllDto;
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Brand code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating Brand: " + e.getMessage(), 500);
        }
    };

    public void deleteBrand(User user, CodeDto codeDto) {
        try {
            UUID brandCode = UUID.fromString(codeDto.getCode());
            Brand brand = brandJpa.findByCode(brandCode)
                    .orElseThrow(() -> new AppException("Brand not found", HttpStatus.NOT_FOUND.value()));

            brand.softDelete();
            brand.setUserDelete(user);
            brandJpa.save(brand);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Brand code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while delete Brand: " + e.getMessage(), 500);
        }
    }

    private BrandAllDto mapToDTO(Brand brand) {
        return new BrandAllDto(brand.getCode().toString(),
                brand.getName(),
                brand.getCreatedAt().toString(),
                brand.getUserCreate().getCode().toString(),
                brand.getUserCreate().getDisplayName(),
                brand.getUpdatedAt().toString(),
                brand.getUserUpdate().getCode().toString(),
                brand.getUserUpdate().getDisplayName());
    }

}
