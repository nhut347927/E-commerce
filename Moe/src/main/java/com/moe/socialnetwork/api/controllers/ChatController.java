package com.moe.socialnetwork.api.controllers;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import com.moe.socialnetwork.api.dtos.RPChatMessageDTO;
import com.moe.socialnetwork.api.dtos.RQMessageDTO;
import com.moe.socialnetwork.api.dtos.RQSeenMessageDTO;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.ContactJPA;
import com.moe.socialnetwork.jpa.UserJPA;
import com.moe.socialnetwork.models.Contact;
import com.moe.socialnetwork.models.User;

@Controller
public class ChatController {

        private SimpMessagingTemplate messagingTemplate;
        private final ContactJPA contactJPA;
        private final UserJPA userJpa;

        public ChatController(SimpMessagingTemplate messagingTemplate, ContactJPA contactJPA, UserJPA userJpa) {
                this.messagingTemplate = messagingTemplate;
                this.contactJPA = contactJPA;
                this.userJpa = userJpa;
        }

        // Gửi tin nhắn riêng tư
        @MessageMapping("/private-message") // client gọi tới /app/private-message
        public void sendPrivateMessage(
                        RQMessageDTO message,
                        @AuthenticationPrincipal User sender // lấy từ token
        ) {

                // Kiểm tra xem người nhận có tôi trong danh bạ không
                if (!contactJPA.hasContact(UUID.fromString(message.getTo()), sender.getCode())) {
                        User recipient = userJpa.findByCode(UUID.fromString(message.getTo()))
                                        .orElseThrow(() -> new AppException("Recipient not found", 404));
                        Contact contact = new Contact();
                        contact.setUser(recipient);
                        contact.setContactUser(sender);
                        contactJPA.save(contact);
                }
                // Gửi lại nội dung, có thể gắn thêm tên người gửi vào content nếu muốn
                RPChatMessageDTO response = new RPChatMessageDTO(
                                null,
                                message.getContent(),
                                sender.getCode().toString(),
                                sender.getAvatar(),
                                LocalDateTime.now().toString());

                // Gửi tới user đích
                messagingTemplate.convertAndSendToUser(
                                message.getTo(), // người nhận
                                "/queue/messages", // đích đến của user
                                response);
        }

        @MessageMapping("/seen-message")
        public void seenMessage(RQSeenMessageDTO rq, @AuthenticationPrincipal User user) {
                // Gọi service cập nhật trạng thái "đã xem"

                // Có thể gửi lại thông báo cho người gửi (nếu muốn hiện "đã xem")
                messagingTemplate.convertAndSendToUser(
                                rq.getFromUserCode(), // người đã gửi tin nhắn
                                "/queue/message-seen", // gửi đến đích
                                user.getCode().toString() // ai là người đã xem
                );
        }

}
