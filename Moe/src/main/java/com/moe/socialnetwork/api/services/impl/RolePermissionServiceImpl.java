package com.moe.socialnetwork.api.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.moe.socialnetwork.models.Role;
import com.moe.socialnetwork.api.dtos.RolePermissionDto;
import com.moe.socialnetwork.api.services.IRolePermissionService;
import com.moe.socialnetwork.jpa.RoleJpa;
import com.moe.socialnetwork.jpa.RolePermissionJpa;
import com.moe.socialnetwork.jpa.UserJpa;
import com.moe.socialnetwork.models.RolePermission;
import com.moe.socialnetwork.models.User;

import jakarta.transaction.Transactional;

import com.moe.socialnetwork.exception.AppException;

/**
 * Author: nhutnm379
 */
@Service
public class RolePermissionServiceImpl implements IRolePermissionService {
    private final RolePermissionJpa rolePermissionJpa;
    private final UserJpa userJpa;
    private final RoleJpa roleJpa;

    public RolePermissionServiceImpl(RolePermissionJpa rolePermissionJpa, UserJpa userJpa, RoleJpa roleJpa) {
        this.rolePermissionJpa = rolePermissionJpa;
        this.userJpa = userJpa;
        this.roleJpa = roleJpa;
    }

    public List<RolePermissionDto> getPermissionsByUser(UUID userCode) {
        List<RolePermission> rolePermissions = rolePermissionJpa.findByUserCode(userCode);

        // Nếu có dữ liệu, chuyển sang DTO và trả về
        if (!rolePermissions.isEmpty()) {
            return rolePermissions.stream()
                    .map(this::toDTO)
                    .toList();
        }

        // Nếu không có, tạo danh sách DTO với role và tất cả quyền là false
        List<Role> allRoles = roleJpa.findAll();

        return allRoles.stream()
                .map(role -> {
                    RolePermissionDto dto = new RolePermissionDto();
                    dto.setUserCode(userCode.toString());
                    dto.setRoleCode(role.getCode().toString());
                    dto.setRoleName(role.getRoleName());
                    dto.setCanView(false);
                    dto.setCanInsert(false);
                    dto.setCanUpdate(false);
                    dto.setCanDelete(false);
                    dto.setCanRestore(false);
                    return dto;
                })
                .toList();
    }

 @Transactional
    public void createOrUpdatePermission(List<RolePermissionDto> rolePermissions) {
        if (rolePermissions.isEmpty()) {
            throw new AppException("No permissions provided", 400);
        }

        String userCode = rolePermissions.get(0).getUserCode();
        User user = userJpa.findByCode(UUID.fromString(userCode))
                .orElseThrow(() -> new AppException("User not found or deleted", 404));

        List<Role> roles = roleJpa.findAll();
        List<RolePermission> result = new ArrayList<>();

        for (RolePermissionDto perDto : rolePermissions) {
            Role role = roles.stream()
                    .filter(r -> r.getCode().toString().equals(perDto.getRoleCode()))
                    .findFirst()
                    .orElseThrow(() -> new AppException("Role not found", 404));

            RolePermission entity;
            if (perDto.getCode() != null && !perDto.getCode().isEmpty()) {
                try {
                    UUID code = UUID.fromString(perDto.getCode());
                    entity = rolePermissionJpa.findByCode(code)
                            .orElseGet(RolePermission::new);
                    entity.setCode(code);
                } catch (IllegalArgumentException ex) {
                    throw new AppException("Invalid UUID format: " + perDto.getCode(), 400);
                }
            } else {
                entity = new RolePermission();
            }

            entity.setUser(user);
            entity.setRole(role);
            entity.setCanView(perDto.getCanView());
            entity.setCanInsert(perDto.getCanInsert());
            entity.setCanUpdate(perDto.getCanUpdate());
            entity.setCanDelete(perDto.getCanDelete());
            entity.setCanRestore(perDto.getCanRestore());

            result.add(entity);
        }

        rolePermissionJpa.saveAll(result);
    }

    public void deletePermission(String code) {
        rolePermissionJpa.deleteByUserCode(UUID.fromString(code));
    }

    private RolePermissionDto toDTO(RolePermission entity) {
        return new RolePermissionDto(
                entity.getCode().toString(),
                entity.getUser().getCode().toString(),
                entity.getRole().getCode().toString(),
                entity.getRole().getRoleName(),
                entity.getCanView(),
                entity.getCanInsert(),
                entity.getCanUpdate(),
                entity.getCanDelete(),
                entity.getCanRestore());
    }
}