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
public class RQMessageDTO {

    private String to; // code của user nhận tin nhắn
    private String content; // Nội dung tin nhắn

}
