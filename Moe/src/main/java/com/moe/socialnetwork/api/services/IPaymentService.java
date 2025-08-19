package com.moe.socialnetwork.api.services;

import java.util.Map;

import com.moe.socialnetwork.api.dtos.ClientOrderCreateDto;
import com.moe.socialnetwork.models.User;

import jakarta.servlet.http.HttpServletRequest;

public interface IPaymentService {
    Map<String, String> vnpayIpn(HttpServletRequest request);

    Map<String, String> createPayment(User user, ClientOrderCreateDto orderCreateDto,
            HttpServletRequest request);
}
