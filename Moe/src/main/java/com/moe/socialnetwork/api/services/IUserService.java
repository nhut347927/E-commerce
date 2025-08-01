package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.UsersDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
/**
 * Author: nhutnm379
 */
public interface IUserService {

    PageDto<UsersDto> searchUsers(String query, int page, int size, String sort);
}
