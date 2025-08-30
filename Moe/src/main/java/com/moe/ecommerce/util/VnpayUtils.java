package com.moe.ecommerce.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class VnpayUtils {

    public static String hmacSHA512(String key, String data) {
        if (key == null || data == null) {
            throw new IllegalArgumentException("Key or data cannot be null");
        }
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKeySpec);
            byte[] hashBytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * hashBytes.length);
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString(); // Removed toUpperCase()
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA512: " + e.getMessage(), e);
        }
    }
}