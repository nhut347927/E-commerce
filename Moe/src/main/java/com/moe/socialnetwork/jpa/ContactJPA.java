package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Contact;

public interface ContactJPA extends JpaRepository<Contact, Long> {
  @Query("""
          SELECT c
          FROM Contact c
          WHERE c.user.code = :userCode
            AND (:key IS NULL OR LOWER(c.contactUser.displayName) LIKE LOWER(CONCAT('%', :key, '%')))
          ORDER BY c.lastMessageTime DESC
      """)
  Page<Contact> findContactsByUserCodeAndKey(
      @Param("userCode") UUID userCode,
      @Param("key") String key,
      Pageable pageable);

  @Query("SELECT c FROM Contact c WHERE c.code = :code")
  Optional<Contact> findByCode(UUID code);

  // kiểm tra người mình nhắn đâ có contact với mình hay không
  @Query("""
          SELECT COUNT(c) > 0
          FROM Contact c
          WHERE c.user.code = :senderCode
            AND c.contactUser.code = :receiverCode
      """)
  boolean hasContact(@Param("senderCode") UUID senderCode,
      @Param("receiverCode") UUID receiverCode);
}
