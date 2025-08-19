package com.moe.socialnetwork.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Data
@Configuration
public class VnpayConfig {

    // Lấy từ application.properties / application.yml
    @Value("${vnpay.tmnCode}")
    private String vnpayTmnCode;

    @Value("${vnpay.hashSecret}")
    private String vnpayHashSecret;

    // Các hằng số cố định
    public static final String VNPAY_PAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String VNPAY_VERSION = "2.1.0";
    public static final String VNPAY_COMMAND = "pay";
    public static final String VNPAY_CURR_CODE = "VND";
    public static final String VNPAY_LOCALE = "vn";
}
