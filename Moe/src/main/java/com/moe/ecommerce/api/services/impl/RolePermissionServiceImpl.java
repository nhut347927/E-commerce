package com.moe.ecommerce.api.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.moe.ecommerce.api.dtos.RolePermissionDto;
import com.moe.ecommerce.api.services.IRolePermissionService;
import com.moe.ecommerce.exception.AppException;
import com.moe.ecommerce.jpa.RoleJpa;
import com.moe.ecommerce.jpa.RolePermissionJpa;
import com.moe.ecommerce.jpa.UserJpa;
import com.moe.ecommerce.models.Role;
import com.moe.ecommerce.models.RolePermission;
import com.moe.ecommerce.models.User;
import com.moe.ecommerce.util.AuthorityUtil;

import jakarta.transaction.Transactional;

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

    public List<String> getAllPermissions(User user) {
        List<RolePermission> rolePermissions = rolePermissionJpa.findByUserCode(user.getCode());
        return AuthorityUtil.convertToAuthorities(rolePermissions).stream().toList();
       
    }

    public List<RolePermissionDto> getPermissionsByUser(UUID userCode) {
        List<RolePermission> rolePermissions = rolePermissionJpa.findByUserCode(userCode);

        // Map nhanh để check role nào đã có permission
        Map<UUID, RolePermission> rolePermissionMap = rolePermissions.stream()
                .collect(Collectors.toMap(rp -> rp.getRole().getCode(), rp -> rp));

        // Lấy toàn bộ role
        List<Role> allRoles = roleJpa.findAll();

        return allRoles.stream()
                .map(role -> {
                    RolePermissionDto dto = new RolePermissionDto();
                    dto.setUserCode(userCode.toString());
                    dto.setRoleCode(role.getCode().toString());
                    dto.setRoleName(role.getRoleName());

                    RolePermission rp = rolePermissionMap.get(role.getCode());
                    if (rp != null) {
                        // Nếu user đã có set quyền cho role này → map từ entity
                        dto.setCanView(rp.getCanView());
                        dto.setCanInsert(rp.getCanInsert());
                        dto.setCanUpdate(rp.getCanUpdate());
                        dto.setCanDelete(rp.getCanDelete());
                        dto.setCanRestore(rp.getCanRestore());
                    } else {
                        // Nếu user chưa có quyền với role này → default false
                        dto.setCanView(false);
                        dto.setCanInsert(false);
                        dto.setCanUpdate(false);
                        dto.setCanDelete(false);
                        dto.setCanRestore(false);
                    }
                    return dto;
                })
                .toList();
    }

    @Transactional
    public void createOrUpdatePermission(User userNow, List<RolePermissionDto> rolePermissions) {

        if (userNow.getId() != 1) {
            throw new AppException("Only super admin can grant permissions", 403);
        }

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

            // 🔑 Luôn tìm theo user + role thay vì chỉ code
            RolePermission entity = rolePermissionJpa.findByUserAndRole(user, role)
                    .orElseGet(RolePermission::new);

            entity.setUser(user);
            entity.setRole(role);
            entity.setCanView(perDto.getCanView());
            entity.setCanInsert(perDto.getCanInsert());
            entity.setCanUpdate(perDto.getCanUpdate());
            entity.setCanDelete(perDto.getCanDelete());
            entity.setCanRestore(perDto.getCanRestore());

            if (entity.getCode() == null) { // nghĩa là bản ghi mới
                entity.setUserCreate(userNow);
            }
            entity.setUserUpdate(userNow);

            result.add(entity);
        }

        rolePermissionJpa.saveAll(result);
    }

    public void deletePermission(String code) {
        rolePermissionJpa.deleteByUserCode(UUID.fromString(code));
    }

    // private RolePermissionDto toDTO(RolePermission entity) {
    // return new RolePermissionDto(
    // entity.getCode().toString(),
    // entity.getUser().getCode().toString(),
    // entity.getRole().getCode().toString(),
    // entity.getRole().getRoleName(),
    // entity.getCanView(),
    // entity.getCanInsert(),
    // entity.getCanUpdate(),
    // entity.getCanDelete(),
    // entity.getCanRestore());
    // }
}