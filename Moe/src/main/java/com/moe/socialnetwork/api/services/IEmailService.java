package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.exception.AppException;

/**
 * Author: nhutnm379
 */
public interface IEmailService {
    void sendContactFormEmail(String name, String email, String message);

    /**
     * Send a password reset email with HTML content to the user.
     *
     * @param email      User's email address
     * @param resetToken Password reset token
     * @throws AppException if email sending fails
     */
    void sendPasswordResetEmail(String email, String resetToken);
}