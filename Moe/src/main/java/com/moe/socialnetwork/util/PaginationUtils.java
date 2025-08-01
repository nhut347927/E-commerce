package com.moe.socialnetwork.util;

import org.springframework.data.domain.*;

import com.moe.socialnetwork.api.dtos.common.PageDto;

import java.util.List;
/**
 * Author: nhutnm379
 */
public class PaginationUtils {

    /**
     * Tạo Pageable từ page, size, sort string.
     * @param page số trang (bắt đầu từ 0)
     * @param size số phần tử mỗi trang
     * @param sort thứ tự ("asc" hoặc "desc")
     * @return Pageable đối tượng
     */
    public static Pageable buildPageable(int page, int size, String sort) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(direction, "id"));
    }

    /**
     * Chuyển Page<?> và danh sách nội dung đã map thành ZRPPageDTO<T>
     * @param page Trang gốc từ JPA
     * @param contents Danh sách dữ liệu sau khi map
     * @return ZRPPageDTO<T>
     */
    public static <T> PageDto<T> buildPageDTO(Page<?> page, List<T> contents) {
        PageDto<T> dto = new PageDto<>();
        dto.setContents(contents);
        dto.setTotalElements(page.getTotalElements());
        dto.setTotalPages(page.getTotalPages());
        dto.setPage(page.getNumber());
        dto.setSize(page.getSize());
        dto.setHasNext(page.hasNext());
        dto.setHasPrevious(page.hasPrevious());
        return dto;
    }
}
