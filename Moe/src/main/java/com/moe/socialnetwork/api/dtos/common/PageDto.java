package com.moe.socialnetwork.api.dtos.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDto<T> {

    private List<T> contents;          // Dữ liệu thực tế
    private long totalElements;        // Tổng số phần tử
    private int totalPages;            // Tổng số trang
    private int page;                  // Trang hiện tại (bắt đầu từ 0)
    private int size;                  // Số phần tử mỗi trang
    private boolean hasNext;           // Còn trang tiếp theo không
    private boolean hasPrevious;       // Có trang trước khôn
}