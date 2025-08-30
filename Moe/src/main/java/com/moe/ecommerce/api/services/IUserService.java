package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.UsersDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;
/**
 * Author: nhutnm379
 */
public interface IUserService {

    PageDto<UsersDto> searchUsers(String query, int page, int size, String sort);
    void deleteUser(User user, CodeDto codeDto);
}
