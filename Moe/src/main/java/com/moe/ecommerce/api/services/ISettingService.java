package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.SettingAllDto;
import com.moe.ecommerce.api.dtos.SettingCreateDto;
import com.moe.ecommerce.api.dtos.SettingUpdateDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;

public interface ISettingService {
    SettingAllDto getSetting(CodeDto codeDto);

    PageDto<SettingAllDto> getSettingAll(String query, int page, int size, String sort);

    SettingAllDto createSetting(User user, SettingCreateDto settingCreateDto);

    SettingAllDto updateSetting(User user, SettingUpdateDto settingUpdateDto);

    void disableSetting(User user, CodeDto codeDto);
}
