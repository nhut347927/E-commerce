package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.ColorCreateDto;
import com.moe.socialnetwork.api.dtos.ColorUpdateDto;
import com.moe.socialnetwork.api.dtos.ColorAllDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

public interface IColorService {
    PageDto<ColorAllDto> getColorAll(String query, int page, int Color, String sort);

    ColorAllDto createColor(User user, ColorCreateDto ColorCreateDto);

    ColorAllDto updateColor(User user, ColorUpdateDto ColorUpdateDto);

    void deleteColor(User user, CodeDto codeDto);
}
