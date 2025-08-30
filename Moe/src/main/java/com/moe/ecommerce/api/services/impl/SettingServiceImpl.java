package com.moe.ecommerce.api.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moe.ecommerce.api.dtos.SettingAllDto;
import com.moe.ecommerce.api.dtos.SettingCreateDto;
import com.moe.ecommerce.api.dtos.SettingUpdateDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.api.services.ISettingService;
import com.moe.ecommerce.exception.AppException;
import com.moe.ecommerce.jpa.SettingJpa;
import com.moe.ecommerce.models.Setting;
import com.moe.ecommerce.models.User;
import com.moe.ecommerce.util.PaginationUtils;

@Service
public class SettingServiceImpl implements ISettingService {

    private final SettingJpa settingJpa;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SettingServiceImpl(SettingJpa settingJpa) {
        this.settingJpa = settingJpa;
    }

    public SettingAllDto getSetting(CodeDto codeDto) {

        UUID settingCode = UUID.fromString(codeDto.getCode());
        Setting setting = settingJpa.findByCode(settingCode)
                .orElseThrow(() -> new AppException("Setting not found", HttpStatus.NOT_FOUND.value()));

        if (setting.getIsActive() == false) {
            throw new AppException("Setting is inactive", HttpStatus.BAD_REQUEST.value());
            
        }

        return mapToDTO(setting);

    }

    public PageDto<SettingAllDto> getSettingAll(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Setting> settings = settingJpa.searchByName(query, pageable);

        List<SettingAllDto> contents = settings.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(settings, contents);

    }

    private void validateJsonData(String jsonData) {
        try {
            objectMapper.readTree(jsonData); // parse thử, nếu sai sẽ ném JsonProcessingException
        } catch (JsonProcessingException e) {
            throw new AppException("Invalid JSON format in 'data' field", HttpStatus.BAD_REQUEST.value());
        }
    }

    public SettingAllDto createSetting(User user, SettingCreateDto settingCreateDto) {
        try {
            // Validate JSON trước
            validateJsonData(settingCreateDto.getData());

            Setting setting = new Setting();
            setting.setName(settingCreateDto.getName());
            setting.setData(settingCreateDto.getData());
            setting.setDescription(settingCreateDto.getDescription());
            setting.setIsActive(settingCreateDto.getIsActive());

            setting.setUserCreate(user);
            setting.setUserUpdate(user);
            settingJpa.save(setting);
            return mapToDTO(setting);
        } catch (AppException e) {
            throw e; // giữ nguyên nếu là AppException
        } catch (Exception e) {
            throw new AppException("An error occurred while creating setting: " + e.getMessage(), 500);
        }
    }

    public SettingAllDto updateSetting(User user, SettingUpdateDto settingUpdateDto) {
        try {
            // Validate JSON trước
            validateJsonData(settingUpdateDto.getData());

            UUID settingCode = UUID.fromString(settingUpdateDto.getCode());
            Setting setting = settingJpa.findByCode(settingCode)
                    .orElseThrow(() -> new AppException("Setting not found", HttpStatus.NOT_FOUND.value()));

            setting.setName(settingUpdateDto.getName());
            setting.setData(settingUpdateDto.getData());
            setting.setDescription(settingUpdateDto.getDescription());
            setting.setIsActive(settingUpdateDto.getIsActive());

            setting.setUserUpdate(user);
            settingJpa.save(setting);
            return mapToDTO(setting);
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid size code format", HttpStatus.BAD_REQUEST.value());
        } catch (AppException e) {
            throw e; // giữ nguyên AppException
        } catch (Exception e) {
            throw new AppException("An error occurred while updating setting: " + e.getMessage(), 500);
        }
    }

    public void disableSetting(User user, CodeDto codeDto) {
        try {
            UUID settingCode = UUID.fromString(codeDto.getCode());
            Setting setting = settingJpa.findByCode(settingCode)
                    .orElseThrow(() -> new AppException("Setting not found", HttpStatus.NOT_FOUND.value()));

            setting.setIsActive(false);
            settingJpa.save(setting);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid size code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while disable setting: " + e.getMessage(), 500);
        }
    }

    private SettingAllDto mapToDTO(Setting setting) {
        return new SettingAllDto(setting.getCode().toString(),
                setting.getName(),
                setting.getData(),
                setting.getDescription(),
                setting.getIsActive(),
                setting.getCreatedAt().toString(),
                setting.getUserCreate().getCode().toString(),
                setting.getUserCreate().getDisplayName(),
                setting.getUpdatedAt().toString(),
                setting.getUserUpdate().getCode().toString(),
                setting.getUserUpdate().getDisplayName());
    }
}
