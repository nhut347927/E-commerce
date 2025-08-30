package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.ClientProductDto;
import com.moe.ecommerce.api.dtos.ClientProductFilterDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;

public interface IWishListService {
    PageDto<ClientProductDto> getWishListProductAll(User user, ClientProductFilterDto dto);

    void toggleWishList(User user, CodeDto codeDto);
}
