package com.moe.socialnetwork.api.services;

import java.util.List;
import java.util.UUID;
import com.moe.socialnetwork.api.dtos.RolePermissionDto;
import com.moe.socialnetwork.models.User;

/**
 * Author: nhutnm379
 */
public interface IRolePermissionService {

    List<String> getAllPermissions(User user);

    List<RolePermissionDto> getPermissionsByUser(UUID userCode);

    void createOrUpdatePermission(User userNow, List<RolePermissionDto> rolePermissions);

    void deletePermission(String code);
}
