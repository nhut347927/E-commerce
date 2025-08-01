package com.moe.socialnetwork.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsersDto {
	private String code;
	private String email;
	private String userName;
	private String displayName;
	private String bio;
	private String provider;
	private String avatar;
	private String dateOfBirth;
	private String gender;
	private boolean isVerified = false;
	private boolean isDeleted = false;
	private String createdAt;
	private String updatedAt;
	private String deletedAt;
	private String userCreate;
	private String userUpdate;
	private String userDelete;
	private String lastLogin;
}
