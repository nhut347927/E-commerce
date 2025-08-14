package com.moe.socialnetwork.api.services;

import java.util.List;

import com.moe.socialnetwork.api.dtos.ProductVersionAllDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.models.User;

public interface ICartService {
    List<ProductVersionAllDto> getCartProductVersions(User user);

    void addToCart(User user, CodeDto codeDto);

    void deleteFromCart(User user, CodeDto codeDto);
}