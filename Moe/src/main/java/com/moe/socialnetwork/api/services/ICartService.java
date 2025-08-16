package com.moe.socialnetwork.api.services;

import java.util.List;

import com.moe.socialnetwork.api.dtos.ClientCartAllDto;
import com.moe.socialnetwork.api.dtos.ClientCartDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.models.User;

public interface ICartService {
    void updateQuantity(User user, String pvCode, int quantity);

    List<ClientCartAllDto> getCartProductVersions(User user);

    void addToCart(User user, ClientCartDto codeDto);

    void deleteFromCart(User user, CodeDto codeDto);
}