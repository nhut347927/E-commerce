package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.SettingAllDto;
import com.moe.socialnetwork.api.dtos.SettingCreateDto;
import com.moe.socialnetwork.api.dtos.SettingUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

public interface ISettingService {
    SettingAllDto getSetting(CodeDto codeDto);

    PageDto<SettingAllDto> getSettingAll(String query, int page, int size, String sort);

    SettingAllDto createSetting(User user, SettingCreateDto settingCreateDto);

    SettingAllDto updateSetting(User user, SettingUpdateDto settingUpdateDto);

    void disableSetting(User user, CodeDto codeDto);
}
