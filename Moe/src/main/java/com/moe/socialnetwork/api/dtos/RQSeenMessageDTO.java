package com.moe.socialnetwork.api.dtos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RQSeenMessageDTO {
    private String fromUserCode; // người đã gửi tin nhắn (mình là người xem)
}
