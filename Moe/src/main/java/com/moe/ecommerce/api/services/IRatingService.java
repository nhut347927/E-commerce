package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.ClientRatingCreateDto;
import com.moe.ecommerce.models.User;

public interface IRatingService {
    void addRating(User user, ClientRatingCreateDto ratingCreateDto);
}
