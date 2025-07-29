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
public class RPMessageDTO {

    private String content; // Nội dung tin nhắn
    private String from; // code của user gửi tin nhắn
    private String createdAt; // Thời gian tạo tin nhắn
}
