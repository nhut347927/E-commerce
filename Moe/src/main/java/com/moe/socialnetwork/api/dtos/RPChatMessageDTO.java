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
public class RPChatMessageDTO {
    private String code;
    private String content;
    private String senderCode;
    private String avatarUrl;
    private String createdAt;
}
