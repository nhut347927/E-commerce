package com.moe.ecommerce.api.services.impl;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moe.ecommerce.api.dtos.ClientRatingCreateDto;
import com.moe.ecommerce.api.services.IRatingService;
import com.moe.ecommerce.exception.AppException;
import com.moe.ecommerce.jpa.OrderItemJpa;
import com.moe.ecommerce.jpa.RatingJpa;
import com.moe.ecommerce.models.OrderItem;
import com.moe.ecommerce.models.Rating;
import com.moe.ecommerce.models.User;

@Service
public class RatingServiceImpl implements IRatingService {
    private final RatingJpa ratingJpa;
    private final OrderItemJpa orderItemJpa;

    public RatingServiceImpl(RatingJpa ratingJpa, OrderItemJpa orderItemJpa) {
        this.ratingJpa = ratingJpa;
        this.orderItemJpa = orderItemJpa;
    }

    @Transactional
    public void addRating(User user, ClientRatingCreateDto ratingCreateDto) {
        try {
            // Check if the order item exists and has not been rated yet
            UUID oICode = UUID.fromString(ratingCreateDto.getOrderItemCode());
            OrderItem orderItem = orderItemJpa.findByCode(oICode)
                    .orElseThrow(() -> new AppException("Order item not found", 400));
            if (orderItem.getRating() != null && orderItem.getRating()) {
                throw new AppException("Order item has already been rated", 400);
            }
            // Create a new rating
            Rating rating = new Rating();
            rating.setRating(ratingCreateDto.getRatingValue());
            rating.setComment(ratingCreateDto.getComment());
            rating.setProduct(orderItem.getProductVersion().getProduct());
            rating.setUserCreate(user);
            rating.setUserUpdate(user);
            ratingJpa.save(rating);

            // Update the order item to reflect that it has been rated
            orderItem.setRating(true);
            orderItemJpa.save(orderItem);
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid size code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating order: " + e.getMessage(), 500);
        }
    }
}
