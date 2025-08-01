package com.moe.socialnetwork.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
/**
 * Author: nhutnm379
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${cors.allowed.origin}")
    private String allowedOrigin;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple in-memory message broker for topic (public chat)
        config.enableSimpleBroker("/topic", "/queue"); // queue dùng cho chat riêng tư
        config.setApplicationDestinationPrefixes("/app"); // client sẽ gửi đến /app/...
        config.setUserDestinationPrefix("/user"); // dùng cho chat riêng tư /user/{username}/...
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(allowedOrigin, "http://localhost:3000");
    }

}
