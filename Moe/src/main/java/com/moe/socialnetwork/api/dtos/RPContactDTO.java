package com.moe.socialnetwork.api.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RPContactDTO {
    private String avatarUrl;
    private String displayName;
    private String userCode;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
}
