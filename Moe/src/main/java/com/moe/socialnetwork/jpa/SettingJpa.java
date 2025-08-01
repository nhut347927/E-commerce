package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Setting;
/**
 * Author: nhutnm379
 */
public interface SettingJpa extends JpaRepository<Setting, Long> {
    
}
