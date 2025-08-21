package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.ClientRatingCreateDto;
import com.moe.socialnetwork.models.User;

public interface IRatingService {
    void addRating(User user, ClientRatingCreateDto ratingCreateDto);
}
