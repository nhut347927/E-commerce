package com.moe.socialnetwork.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Author: nhutnm379
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/google-login",
                                "/api/auth/change-password", "/api/auth/password-reset-request",
                                "/api/auth/password-reset", "/api/auth/refresh-token", // "/api/auth/logout",
                                "api/file/upload-image", "api/file/upload-video", "/api/file/upload-audio",
                                "/api/file/upload-any", "/api/payment/ipn" // IPN for payment gateway

                                , "/api/email/contact" // contact page

                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/user/me", "/api/setting/get", "/api/blog/client/all",
                                "/api/product/client/all"// home page
                                , "/api/product/category/all", "/api/product/brand/all", "/api/product/tag/all",
                                "/api/product-version/size/all", "/api/product-version/color/all" // product page
                                , "/api/blog" // blog detail page
                                , "api/product/client" // product detail page
                                ,"/api/role-permission/client/list-permissions"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/analytic/**", "/api/logs/active-users")
                        .hasAuthority("DASHBOARD_VIEW")

                        .requestMatchers(HttpMethod.GET, "/api/logs").hasAuthority("LOG_VIEW")
                        .requestMatchers(HttpMethod.GET, "/api/user").hasAuthority("USER_VIEW")
                        .requestMatchers(HttpMethod.DELETE, "/api/user").hasAuthority("USER_DELETE")
                        .requestMatchers(HttpMethod.GET, "/api/role-permission/user").hasAuthority("PERMISSION_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/role-permission").hasAuthority("PERMISSION_UPDATE")

                        .requestMatchers(HttpMethod.GET, "/api/product/all").hasAuthority("PRODUCT_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/product").hasAuthority("PRODUCT_INSERT")
                        .requestMatchers(HttpMethod.PUT, "/api/product").hasAuthority("PRODUCT_UPDATE")
                        .requestMatchers(HttpMethod.DELETE, "/api/product").hasAuthority("PRODUCT_DELETE")

                        .requestMatchers(HttpMethod.GET, "/api/category/all").hasAuthority("CATEGORY_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/category").hasAuthority("CATEGORY_INSERT")
                        .requestMatchers(HttpMethod.PUT, "/api/category").hasAuthority("CATEGORY_UPDATE")
                        .requestMatchers(HttpMethod.DELETE, "/api/category").hasAuthority("CATEGORY_DELETE")

                        .requestMatchers(HttpMethod.GET, "/api/brand/all").hasAuthority("BRAND_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/brand").hasAuthority("BRAND_INSERT")
                        .requestMatchers(HttpMethod.PUT, "/api/brand").hasAuthority("BRAND_UPDATE")
                        .requestMatchers(HttpMethod.DELETE, "/api/brand").hasAuthority("BRAND_DELETE")

                        .requestMatchers(HttpMethod.GET, "/api/tag/all").hasAuthority("TAG_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/tag").hasAuthority("TAG_INSERT")
                        .requestMatchers(HttpMethod.PUT, "/api/tag").hasAuthority("TAG_UPDATE")
                        .requestMatchers(HttpMethod.DELETE, "/api/tag").hasAuthority("TAG_DELETE")

                        .requestMatchers(HttpMethod.GET, "/api/color/all").hasAuthority("COLOR_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/color").hasAuthority("COLOR_INSERT")
                        .requestMatchers(HttpMethod.PUT, "/api/color").hasAuthority("COLOR_UPDATE")
                        .requestMatchers(HttpMethod.DELETE, "/api/color").hasAuthority("COLOR_DELETE")

                        .requestMatchers(HttpMethod.GET, "/api/size/all").hasAuthority("SIZE_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/size").hasAuthority("SIZE_INSERT")
                        .requestMatchers(HttpMethod.PUT, "/api/size").hasAuthority("SIZE_UPDATE")
                        .requestMatchers(HttpMethod.DELETE, "/api/size").hasAuthority("SIZE_DELETE")

                        .requestMatchers(HttpMethod.GET, "/api/product-version/all")
                        .hasAuthority("PRODUCT_VERSION_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/product-version").hasAuthority("PRODUCT_VERSION_INSERT")
                        .requestMatchers(HttpMethod.PUT, "/api/product-version").hasAuthority("PRODUCT_VERSION_UPDATE")
                        .requestMatchers(HttpMethod.DELETE, "/api/product-version")
                        .hasAuthority("PRODUCT_VERSION_DELETE")

                        .requestMatchers(HttpMethod.GET, "/api/blog/all").hasAuthority("BLOG_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/blog").hasAuthority("BLOG_INSERT")
                        .requestMatchers(HttpMethod.PUT, "/api/blog").hasAuthority("BLOG_UPDATE")
                        .requestMatchers(HttpMethod.DELETE, "/api/blog").hasAuthority("BLOG_DELETE")

                        .requestMatchers(HttpMethod.GET, "/api/order/all").hasAuthority("ORDER_VIEW")
                        .requestMatchers(HttpMethod.PUT, "/api/order").hasAuthority("ORDER_UPDATE")

                        .requestMatchers(HttpMethod.GET, "/api/discount/all").hasAuthority("DISCOUNT_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/discount/code", "/api/discount/product")
                        .hasAuthority("DISCOUNT_INSERT")
                        .requestMatchers(HttpMethod.PUT, "/api/discount/code", "/api/discount/product")
                        .hasAuthority("DISCOUNT_UPDATE")
                        .requestMatchers(HttpMethod.DELETE, "/api/discount").hasAuthority("DISCOUNT_DELETE")

                        .requestMatchers(HttpMethod.GET, "/api/setting").hasAuthority("SETTING_VIEW")
                        .requestMatchers(HttpMethod.POST, "/api/setting").hasAuthority("SETTING_INSERT")
                        .requestMatchers(HttpMethod.PUT, "/api/setting").hasAuthority("SETTING_UPDATE")
                        .requestMatchers(HttpMethod.POST, "/api/setting/disable").hasAuthority("SETTING_DELETE")

                        .anyRequest().authenticated())
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
