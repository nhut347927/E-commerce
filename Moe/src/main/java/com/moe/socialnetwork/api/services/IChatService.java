package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.RPChatMessageDTO;
import com.moe.socialnetwork.api.dtos.RPContactDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.models.User;

/**
 * Author: nhutnm379
 */
public interface IChatService {
    void addContact(User user, String contactCode);

    ZRPPageDTO<RPContactDTO> getContactDetails(User user, String query, int page, int size, String sort);

    ZRPPageDTO<RPChatMessageDTO> getChatMessage(User user, String userCode, String chatMessageCode, int page,
            int size, String sort);

    void deleteChatMessage(User user, String chatMessageCode);

    void deleteContact(User user, String contactCode);
}
