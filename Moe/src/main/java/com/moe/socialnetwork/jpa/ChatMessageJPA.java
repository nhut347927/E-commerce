package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.ChatMessage;

public interface ChatMessageJPA extends JpaRepository<ChatMessage, Long> {
    @Query("""
                SELECT m FROM ChatMessage m
                WHERE
                    (
                        (m.sender.code = :user1Code AND m.receiver.code = :user2Code)
                        OR
                        (m.sender.code = :user2Code AND m.receiver.code = :user1Code)
                    )
                    AND (:beforeId IS NULL OR m.id < :beforeId)
            """)
    Page<ChatMessage> findMessagesBeforeIdBetweenUsers(
            @Param("user1Code") UUID user1Code,
            @Param("user2Code") UUID user2Code,
            @Param("beforeId") Long beforeId,
            Pageable pageable);

    @Query("SELECT m FROM ChatMessage m WHERE m.code = :code")
    Optional<ChatMessage> findByCode(UUID code);

}
