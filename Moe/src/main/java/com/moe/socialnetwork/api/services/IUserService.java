package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.UsersDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;
/**
 * Author: nhutnm379
 */
public interface IUserService {

    PageDto<UsersDto> searchUsers(String query, int page, int size, String sort);
    void deleteUser(User user, CodeDto codeDto);
}
