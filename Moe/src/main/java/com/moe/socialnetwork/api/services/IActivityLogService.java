package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.ActivityLogDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;
/**
 * Author: nhutnm379
 */
public interface IActivityLogService {
     void logActivity(User user, String message, String error, String code, String data);
     PageDto<ActivityLogDto> getLog(String query, int page, int size, String sort);
}
