package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.SizeAllDto;
import com.moe.socialnetwork.api.dtos.SizeCreateDto;
import com.moe.socialnetwork.api.dtos.SizeUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.ISizeService;
import com.moe.socialnetwork.exception.AppException;
/**
 * Author: nhutnm379
 */
import com.moe.socialnetwork.jpa.SizeJpa;
import com.moe.socialnetwork.models.Size;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class SizeServiceImpl implements ISizeService {
    private final SizeJpa sizeJpa;

    public SizeServiceImpl(SizeJpa sizeJpa) {
        this.sizeJpa = sizeJpa;
    }

    public PageDto<SizeAllDto> getSizeAll(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Size> sizes = sizeJpa.searchByName(query, pageable);

        List<SizeAllDto> contents = sizes.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(sizes, contents);

    }

    public SizeAllDto createSize(User user, SizeCreateDto sizeCreateDto) {
        try {
            Size size = new Size();
            size.setName(sizeCreateDto.getName());
            size.setUserCreate(user);
            size.setUserUpdate(user);
            sizeJpa.save(size);
            SizeAllDto sizeAllDto = mapToDTO(size);
            return sizeAllDto;
        } catch (Exception e) {
            throw new AppException("An error occurred while creating size: " + e.getMessage(), 500);
        }
    };

    public SizeAllDto updateSize(User user, SizeUpdateDto sizeUpdateDto) {
        try {
            UUID sizeCode = UUID.fromString(sizeUpdateDto.getCode());
            Size size = sizeJpa.findByCode(sizeCode)
                    .orElseThrow(() -> new AppException("Size not found", HttpStatus.NOT_FOUND.value()));

            size.setName(sizeUpdateDto.getName());
            size.setUserUpdate(user);
            sizeJpa.save(size);
            SizeAllDto sizeAllDto = mapToDTO(size);
            return sizeAllDto;
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid size code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating size: " + e.getMessage(), 500);
        }
    };

    public void deleteSize(User user, CodeDto codeDto) {
        try {
            UUID sizeCode = UUID.fromString(codeDto.getCode());
            Size size = sizeJpa.findByCode(sizeCode)
                    .orElseThrow(() -> new AppException("Size not found", HttpStatus.NOT_FOUND.value()));

            size.softDelete();
            size.setUserDelete(user);
            sizeJpa.save(size);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid size code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while delete size: " + e.getMessage(), 500);
        }
    }

    private SizeAllDto mapToDTO(Size size) {
        return new SizeAllDto(size.getCode().toString(),
                size.getName(),
                size.getCreatedAt().toString(),
                size.getUserCreate().getCode().toString(),
                size.getUserCreate().getDisplayName(),
                size.getUpdatedAt().toString(),
                size.getUserUpdate().getCode().toString(),
                size.getUserUpdate().getDisplayName());
    }

}
