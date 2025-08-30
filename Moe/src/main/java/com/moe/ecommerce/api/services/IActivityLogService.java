package com.moe.ecommerce.api.services;

import com.moe.ecommerce.api.dtos.ActivityLogDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;
/**
 * Author: nhutnm379
 */
public interface IActivityLogService {
     void logActivity(User user, String message, String error, String code, String data);
     PageDto<ActivityLogDto> getLog(String query, int page, int size, String sort);
}
