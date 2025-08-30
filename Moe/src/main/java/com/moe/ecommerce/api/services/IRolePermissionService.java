package com.moe.ecommerce.api.services;

import java.util.List;
import java.util.UUID;

import com.moe.ecommerce.api.dtos.RolePermissionDto;
import com.moe.ecommerce.models.User;

/**
 * Author: nhutnm379
 */
public interface IRolePermissionService {

    List<String> getAllPermissions(User user);

    List<RolePermissionDto> getPermissionsByUser(UUID userCode);

    void createOrUpdatePermission(User userNow, List<RolePermissionDto> rolePermissions);

    void deletePermission(String code);
}
