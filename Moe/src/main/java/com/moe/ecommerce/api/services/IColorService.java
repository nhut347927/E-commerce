package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.ColorAllDto;
import com.moe.ecommerce.api.dtos.ColorCreateDto;
import com.moe.ecommerce.api.dtos.ColorUpdateDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;

public interface IColorService {
    PageDto<ColorAllDto> getColorAll(String query, int page, int Color, String sort);

    ColorAllDto createColor(User user, ColorCreateDto ColorCreateDto);

    ColorAllDto updateColor(User user, ColorUpdateDto ColorUpdateDto);

    void deleteColor(User user, CodeDto codeDto);
}
