package com.moe.socialnetwork.api.services.impl;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.RPChatMessageDTO;
import com.moe.socialnetwork.api.dtos.RPContactDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.services.IChatService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.ChatMessageJPA;
import com.moe.socialnetwork.jpa.ContactJPA;
import com.moe.socialnetwork.jpa.UserJPA;
import com.moe.socialnetwork.models.ChatMessage;
import com.moe.socialnetwork.models.Contact;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class ChatServiceImpl implements IChatService {

        private final ChatMessageJPA chatMessageJPA;
        private final ContactJPA contactJPA;
        private final UserJPA userJpa;

        public ChatServiceImpl(ChatMessageJPA chatMessageJPA, ContactJPA contactJPA, UserJPA userJpa) {
                this.chatMessageJPA = chatMessageJPA;
                this.contactJPA = contactJPA;
                this.userJpa = userJpa;
        }

        public void addContact(User user, String contactCode) {
                if (contactJPA.hasContact(user.getCode(), UUID.fromString(contactCode))) {
                        throw new AppException("Contact already exists", 400);
                }
                // Tạo mới Contact
                Contact contact = new Contact();
                contact.setUser(user);
                contact.setContactUser(userJpa.findByCode(UUID.fromString(contactCode))
                                .orElseThrow(() -> new AppException("Contact not found", 404)));
                contactJPA.save(contact);
        }

        public ZRPPageDTO<RPContactDTO> getContactDetails(User user, String query, int page, int size, String sort) {
                Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
                Page<Contact> contacts = contactJPA.findContactsByUserCodeAndKey(user.getCode(), query, pageable);

                List<RPContactDTO> contents = contacts.hasContent()
                                ? contacts.getContent().stream()
                                                .map(contact -> new RPContactDTO(
                                                                contact.getContactUser().getAvatar(),
                                                                contact.getContactUser().getDisplayName(),
                                                                contact.getContactUser().getCode().toString(),
                                                                contact.getLastMessage(),
                                                                contact.getLastMessageTime()))
                                                .toList()
                                : Collections.emptyList();

                return PaginationUtils.buildPageDTO(contacts, contents);
        }

        public ZRPPageDTO<RPChatMessageDTO> getChatMessage(User user, String userCode, String chatMessageCode, int page,
                        int size, String sort) {

                Long beforeId = null;
                if (chatMessageCode != null && !chatMessageCode.isEmpty()) {

                        ChatMessage chatMessage = chatMessageJPA.findByCode(UUID.fromString(chatMessageCode))
                                        .orElseThrow(() -> new AppException("Chat message not found", 404));
                        beforeId = chatMessage.getId();
                }

                UUID otherUserCode = UUID.fromString(userCode);

                Pageable pageable = PaginationUtils.buildPageable(page, size, sort != null ? sort : "id,desc");

                Page<ChatMessage> chats = chatMessageJPA.findMessagesBeforeIdBetweenUsers(
                                user.getCode(),
                                otherUserCode,
                                beforeId,
                                pageable);

                List<RPChatMessageDTO> contents = chats.hasContent()
                                ? chats.getContent().stream()
                                                .map(chat -> new RPChatMessageDTO(
                                                                chat.getCode().toString(),
                                                                chat.getContent(),
                                                                chat.getSender().getCode().toString(),
                                                                chat.getSender().getAvatar(),
                                                                chat.getCreatedAt().toString()))
                                                .toList()
                                : Collections.emptyList();

                return PaginationUtils.buildPageDTO(chats, contents);
        }

        public void deleteChatMessage(User user, String chatMessageCode) {
                ChatMessage chatMessage = chatMessageJPA.findByCode(UUID.fromString(chatMessageCode))
                                .orElseThrow(() -> new AppException("Chat message not found", 404));

                if (!chatMessage.getSender().getCode().equals(user.getCode())) {
                        throw new AppException("You are not authorized to delete this message", 403);
                }

                chatMessageJPA.delete(chatMessage);
        }

        public void deleteContact(User user, String contactCode) {
                Contact contact = contactJPA.findByCode(UUID.fromString(contactCode))
                                .orElseThrow(() -> new AppException("Contact not found", 404));

                if (!contact.getUser().getCode().equals(user.getCode())) {
                        throw new AppException("You are not authorized to delete this contact", 403);
                }

                contactJPA.delete(contact);
        }
}
