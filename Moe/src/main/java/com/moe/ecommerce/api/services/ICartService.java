package com.moe.ecommerce.api.services;

import java.util.List;

import com.moe.ecommerce.api.dtos.ClientCartAllDto;
import com.moe.ecommerce.api.dtos.ClientCartDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.models.User;

public interface ICartService {
    void updateQuantity(User user, String pvCode, int quantity);

    List<ClientCartAllDto> getCartProductVersions(User user);

    void addToCart(User user, ClientCartDto codeDto);

    void deleteFromCart(User user, CodeDto codeDto);
}