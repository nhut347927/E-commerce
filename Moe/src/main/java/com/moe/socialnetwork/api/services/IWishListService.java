package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.ClientProductDto;
import com.moe.socialnetwork.api.dtos.ClientProductFilterDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

public interface IWishListService {
    PageDto<ClientProductDto> getWishListProductAll(User user, ClientProductFilterDto dto);

    void toggleWishList(User user, CodeDto codeDto);
}
