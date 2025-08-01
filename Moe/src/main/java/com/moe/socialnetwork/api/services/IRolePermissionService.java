package com.moe.socialnetwork.api.services;

import java.util.List;
import java.util.UUID;
import com.moe.socialnetwork.api.dtos.RolePermissionDto;

/**
 * Author: nhutnm379
 */
public interface IRolePermissionService {
    List<RolePermissionDto> getPermissionsByUser(UUID userCode);

    void createOrUpdatePermission(List<RolePermissionDto> rolePermissions);

    void deletePermission(String code);
}
