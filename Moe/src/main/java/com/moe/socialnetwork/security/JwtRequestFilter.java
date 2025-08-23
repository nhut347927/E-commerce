package com.moe.socialnetwork.security;

import java.io.IOException;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moe.socialnetwork.api.services.IActivityLogService;
import com.moe.socialnetwork.auth.active.UserActivityContextService;
import com.moe.socialnetwork.auth.services.impl.TokenServiceImpl;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;
import com.moe.socialnetwork.exception.AppException;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    private final CustomUserDetailsService userDetailsService;
    private final TokenServiceImpl tokenService;
    private final IActivityLogService activityLogService;
    private final UserActivityContextService userActivityContextService;

    public JwtRequestFilter(CustomUserDetailsService userDetailsService, TokenServiceImpl tokenService,
            IActivityLogService activityLogService, UserActivityContextService userActivityContextService) {
        this.userDetailsService = userDetailsService;
        this.tokenService = tokenService;
        this.activityLogService = activityLogService;
        this.userActivityContextService = userActivityContextService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain chain) throws ServletException, IOException {

        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        String jwt = extractToken(wrappedRequest);
        String email = null;
        User user = null;

        // Check if endpoint requires authentication
        boolean isPublicEndpoint = isPublicEndpoint(wrappedRequest);

        // Try to authenticate if JWT is present
        if (jwt != null) {
            try {
                if (tokenService.validateJwtToken(jwt)) {
                    email = tokenService.getEmailFromJwtToken(jwt);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    if (userDetails != null) {
                        user = (User) userDetails;
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(wrappedRequest));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logSuccess(user, "Successful authentication for user: " + email, wrappedRequest);
                    } else {
                        logFailure(null, "User not found for email: " + email, null, "401", wrappedRequest);
                        if (!isPublicEndpoint) {
                            sendErrorResponse(response, "User not found", 401);
                            return;
                        }
                    }
                } else {
                    logFailure(null, "Invalid JWT token", null, "401", wrappedRequest);
                    if (!isPublicEndpoint) {
                        sendErrorResponse(response, "Invalid JWT token", 401);
                        return;
                    }
                }
            } catch (ExpiredJwtException e) {
                logFailure(null, "Expired JWT token", e.getMessage(), "401", wrappedRequest);
                if (!isPublicEndpoint) {
                    sendErrorResponse(response, "JWT token has expired. Please log in again.", 401);
                    return;
                }
            } catch (AppException e) {
                logFailure(null, "Authentication error: AppException", e.getMessage(), "500", wrappedRequest);
                if (!isPublicEndpoint) {
                    sendErrorResponse(response, "Application error: " + sanitizeMessage(e.getMessage()), 500);
                    return;
                }
            } catch (Exception e) {
                logFailure(null, "Invalid JWT token format", e.getMessage(), "401", wrappedRequest);
                if (!isPublicEndpoint) {
                    sendErrorResponse(response, "Invalid JWT token format", 401);
                    return;
                }
            }
        } else if (!isPublicEndpoint) {
            logFailure(null, "Missing JWT token", null, "401", wrappedRequest);
            sendErrorResponse(response, "JWT token is missing", 401);
            return;
        }

        // Proceed with the request
        chain.doFilter(wrappedRequest, response);

        // Log anonymous access for public endpoints if no user was authenticated
        if (user == null && isPublicEndpoint) {
            logSuccess(null, "Anonymous access to public endpoint", wrappedRequest);
        }
    }

    private String extractToken(HttpServletRequest request) {
        String jwt = tokenService.extractAccessTokenFromCookie(request);
        if (jwt == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);
            }
        }
        return jwt;
    }

    private boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/register") ||
                path.startsWith("/api/auth/login") ||
                path.startsWith("/api/auth/google-login") ||
                path.startsWith("/api/auth/change-password") ||
                path.startsWith("/api/auth/password-reset-request") ||
                path.startsWith("/api/auth/password-reset") ||
                path.startsWith("/api/auth/refresh-token") ||
                path.startsWith("/api/file/upload-image") ||
                path.startsWith("/api/file/upload-video") ||
                path.startsWith("/api/file/upload-audio") ||
                path.startsWith("/api/file/upload-any") ||
                path.startsWith("/api/payment/ipn") ||
                path.startsWith("/api/user/me") ||
                path.startsWith("/api/setting/get") ||
                path.startsWith("/api/blog/client/all") ||
                path.startsWith("/api/product/client/all") ||
                path.startsWith("/api/product/category/all") ||
                path.startsWith("/api/product/brand/all") ||
                path.startsWith("/api/product/tag/all") ||
                path.startsWith("/api/product-version/size/all") ||
                path.startsWith("/api/product-version/color/all") ||
                path.startsWith("/api/email/contact") ||
                path.startsWith("/api/blog") ||
                path.startsWith("/api/product/client")
                || path.startsWith("/api/role-permission/client/list-permissions");
    }

    private void sendErrorResponse(HttpServletResponse response, String message, int statusCode) throws IOException {
        ResponseAPI<String> res = new ResponseAPI<>();
        res.setCode(statusCode);
        res.setMessage(message);
        res.setData(null);

        response.setStatus(statusCode);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ObjectMapper mapper = new ObjectMapper();
        String jsonResponse = mapper.writeValueAsString(res);
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }

    private String sanitizeMessage(String message) {
        if (message == null) {
            return null;
        }
        return message.replaceAll("(?i)(password|token|creditCard)\\s*[:=]\\s*[^\\s,\\n]+", "$1: [REDACTED]");
    }

    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] buf = request.getContentAsByteArray();
        if (buf.length == 0) {
            return "";
        }
        try {
            return new String(buf, 0, buf.length,
                    request.getCharacterEncoding() != null ? request.getCharacterEncoding() : "UTF-8");
        } catch (Exception e) {
            return "[Error reading request body]";
        }
    }

    private void logFailure(User user, String message, String error, String statusCode, HttpServletRequest req) {
        String query = getQueryOrBody(req);
        String path = req.getRequestURI();
        String ip = req.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = req.getRemoteAddr();
        }

        if (!(path.startsWith("/api/logs") || path.startsWith("/api/logs/active-users"))) {
            activityLogService.logActivity(user, message, error, statusCode, query);
        }

        String fullMessage = String.format("[%s] %s", ip, message);
        logger.warn(fullMessage);

        if (user != null) {
            userActivityContextService.addUserActivity(user.getCode().toString(), user.getDisplayName(), fullMessage);
        } else {
            userActivityContextService.addUserActivity("anonymous", "Anonymous", fullMessage);
        }
    }

    private void logSuccess(User user, String message, HttpServletRequest req) {
        String query = getQueryOrBody(req);
        String path = req.getRequestURI();
        String ip = req.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = req.getRemoteAddr();
        }

        if (!(path.startsWith("/api/logs") || path.startsWith("/api/logs/active-users"))) {
            activityLogService.logActivity(user, message, null, "200", query);
        }

        String fullMessage = String.format("[%s] %s", ip, message);
        logger.info(fullMessage);

        if (user != null) {
            userActivityContextService.addUserActivity(user.getCode().toString(), user.getDisplayName(), fullMessage);
        } else {
            userActivityContextService.addUserActivity("anonymous", "Anonymous", fullMessage);
        }
    }

    private String getQueryOrBody(HttpServletRequest request) {
        String method = request.getMethod();
        if ("GET".equalsIgnoreCase(method)) {
            return request.getQueryString() != null ? request.getQueryString() : "";
        }
        return getRequestBody((ContentCachingRequestWrapper) request);
    }
}