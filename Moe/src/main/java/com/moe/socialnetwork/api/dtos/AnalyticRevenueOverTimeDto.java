package com.moe.socialnetwork.api.dtos;

import java.time.LocalDate;

public class AnalyticRevenueOverTimeDto {
    private LocalDate dateTime;
    private Long orderCount;

    // Constructor Hibernate cần (java.sql.Date, Long)
    public AnalyticRevenueOverTimeDto(java.sql.Date dateTime, Long orderCount) {
        this.dateTime = dateTime.toLocalDate();
        this.orderCount = orderCount;
    }

    // Optional: Constructor LocalDate, Long nếu muốn dùng tay
    public AnalyticRevenueOverTimeDto(LocalDate dateTime, Long orderCount) {
        this.dateTime = dateTime;
        this.orderCount = orderCount;
    }

    public LocalDate getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDate dateTime) {
        this.dateTime = dateTime;
    }

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }
}
