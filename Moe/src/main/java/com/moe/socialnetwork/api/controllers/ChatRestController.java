package com.moe.socialnetwork.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.RPChatMessageDTO;
import com.moe.socialnetwork.api.dtos.RPContactDTO;
import com.moe.socialnetwork.api.dtos.RQChatMessageDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.dtos.ZRQFilterPageDTO;
import com.moe.socialnetwork.api.services.IChatService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {
    private final IChatService chatService;

    public ChatRestController(IChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/contacts")
    public ResponseEntity<ResponseAPI<Void>> addContact(
            @Valid @RequestBody ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        chatService.addContact(user, request.getCode());

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Contact added successfully");
        response.setData(null);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPChatMessageDTO>>> getChatMessage(
            @Valid @ModelAttribute RQChatMessageDTO request,
            @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPChatMessageDTO> data = chatService.getChatMessage(
                user,
                request.getUserCode(),
                request.getChatMessageCode(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<ZRPPageDTO<RPChatMessageDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/contacts")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPContactDTO>>> getContactDetails(
            @Valid @ModelAttribute ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPContactDTO> data = chatService.getContactDetails(
                user,
                request.getKeyWord(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<ZRPPageDTO<RPContactDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/contacts")
    public ResponseEntity<ResponseAPI<Void>> deleteContact(
            @Valid @RequestBody ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        chatService.deleteContact(user, request.getCode());

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<Void>> deleteChatMessage(
            @Valid @RequestBody ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        chatService.deleteChatMessage(user, request.getCode());

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.ok(response);
    }

}
