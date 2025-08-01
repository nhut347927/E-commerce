package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.ColorAllDto;
import com.moe.socialnetwork.api.dtos.ColorCreateDto;
import com.moe.socialnetwork.api.dtos.ColorUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IColorService;
import com.moe.socialnetwork.exception.AppException;
/**
 * Author: nhutnm379
 */
import com.moe.socialnetwork.jpa.ColorJpa;
import com.moe.socialnetwork.models.Color;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class ColorServiceImpl implements IColorService {
    private final ColorJpa colorJpa;

    public ColorServiceImpl(ColorJpa colorJpa) {
        this.colorJpa = colorJpa;
    }

    public PageDto<ColorAllDto> getColorAll(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Color> colors = colorJpa.searchByName(query, pageable);

        List<ColorAllDto> contents = colors.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(colors, contents);

    }

    public ColorAllDto createColor(User user, ColorCreateDto colorCreateDto) {
        try {
            Color color = new Color();
            color.setName(colorCreateDto.getName());
            color.setUserCreate(user);
            color.setUserUpdate(user);
            colorJpa.save(color);
            ColorAllDto colorAllDto = mapToDTO(color);
            return colorAllDto;
        } catch (Exception e) {
            throw new AppException("An error occurred while creating Color: " + e.getMessage(), 500);
        }
    };

    public ColorAllDto updateColor(User user, ColorUpdateDto colorUpdateDto) {
        try {
            UUID colorCode = UUID.fromString(colorUpdateDto.getCode());
            Color color = colorJpa.findByCode(colorCode)
                    .orElseThrow(() -> new AppException("Color not found", HttpStatus.NOT_FOUND.value()));

            color.setName(colorUpdateDto.getName());
            color.setUserUpdate(user);
            colorJpa.save(color);
            ColorAllDto colorAllDto = mapToDTO(color);
            return colorAllDto;
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Color code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating Color: " + e.getMessage(), 500);
        }
    };

    public void deleteColor(User user, CodeDto codeDto) {
        try {
            UUID colorCode = UUID.fromString(codeDto.getCode());
            Color color = colorJpa.findByCode(colorCode)
                    .orElseThrow(() -> new AppException("Color not found", HttpStatus.NOT_FOUND.value()));

            color.softDelete();
            color.setUserDelete(user);
            colorJpa.save(color);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Color code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while delete Color: " + e.getMessage(), 500);
        }
    }

    private ColorAllDto mapToDTO(Color color) {
        return new ColorAllDto(color.getCode().toString(),
                color.getName(),
                color.getCreatedAt().toString(),
                color.getUserCreate().getCode().toString(),
                color.getUserCreate().getDisplayName(),
                color.getUpdatedAt().toString(),
                color.getUserUpdate().getCode().toString(),
                color.getUserUpdate().getDisplayName());
    }

}
