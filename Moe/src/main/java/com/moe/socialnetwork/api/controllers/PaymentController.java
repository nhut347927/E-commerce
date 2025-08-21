package com.moe.socialnetwork.api.controllers;

import com.moe.socialnetwork.api.dtos.ClientOrderCreateDto;
import com.moe.socialnetwork.api.services.IPaymentService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final IPaymentService paymentService;

    public PaymentController(IPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseAPI<Map<String, String>>> createPayment(
            @RequestBody ClientOrderCreateDto orderCreateDto,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {

        Map<String, String> data = paymentService.createPayment(user, orderCreateDto, request);
        ResponseAPI<Map<String, String>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/ipn")
    public Map<String, String> vnpayIpn(HttpServletRequest request) {
        return paymentService.vnpayIpn(request);
    }
    
}
