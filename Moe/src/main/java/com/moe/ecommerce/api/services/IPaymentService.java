package com.moe.ecommerce.api.services;

import java.util.Map;

import com.moe.ecommerce.api.dtos.ClientOrderCreateDto;
import com.moe.ecommerce.models.User;

import jakarta.servlet.http.HttpServletRequest;

public interface IPaymentService {
    Map<String, String> vnpayIpn(HttpServletRequest request);

    Map<String, String> createPayment(User user, ClientOrderCreateDto orderCreateDto,
            HttpServletRequest request);
}
