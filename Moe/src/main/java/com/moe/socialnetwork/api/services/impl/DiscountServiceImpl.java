package com.moe.socialnetwork.api.services.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.DiscountAllDto;
import com.moe.socialnetwork.api.dtos.DiscountCreateCoDto;
import com.moe.socialnetwork.api.dtos.DiscountCreateProDto;
import com.moe.socialnetwork.api.dtos.DiscountUpdateCoDto;
import com.moe.socialnetwork.api.dtos.DiscountUpdateProDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IDiscountService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.DiscountJpa;
import com.moe.socialnetwork.jpa.ProductJpa;
import com.moe.socialnetwork.models.Discount;
import com.moe.socialnetwork.models.Product;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;
import com.moe.socialnetwork.util.TextNormalizer;

@Service
public class DiscountServiceImpl implements IDiscountService {
    private final DiscountJpa discountJpa;
    private final ProductJpa productJpa;

    public DiscountServiceImpl(DiscountJpa discountJpa, ProductJpa productJpa) {
        this.discountJpa = discountJpa;
        this.productJpa = productJpa;
    }

    public PageDto<DiscountAllDto> getDiscountAll(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Discount> discounts = discountJpa.searchByName(query, pageable);

        List<DiscountAllDto> contents = discounts.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(discounts, contents);

    }

    public DiscountAllDto createDiscountCo(User user, DiscountCreateCoDto dto) {
        try {
            validateDates(dto.getStartDate(), dto.getEndDate());

            Discount discount = new Discount();
            String m = TextNormalizer.removeVietnameseAccents(dto.getDiscountCode());
            String s = TextNormalizer.removeWhitespace(m);
            discount.setDiscountCode(s.trim());
            discount.setDiscountType(dto.getDiscountType());
            discount.setDescription(dto.getDescription());
            discount.setDiscountValue(dto.getDiscountValue());
            discount.setMaxDiscount(dto.getMaxDiscount());
            discount.setStartDate(dto.getStartDate());
            discount.setEndDate(dto.getEndDate());
            discount.setIsActive(dto.getIsActive());
            discount.setUsageLimit(dto.getUsageLimit());

            discount.setUserCreate(user);
            discount.setUserUpdate(user);

            discountJpa.save(discount);
            return mapToDTO(discount);

        } catch (DataIntegrityViolationException e) {
            // do chỉ có một cột unique nên sài trực tiếp
            throw new AppException("Discount code already exists", 409);
        } catch (Exception e) {
            throw new AppException("An error occurred while creating Discount: " + e.getMessage(), 500);
        }
    }

    public DiscountAllDto updateDiscountCo(User user, DiscountUpdateCoDto discountUpdateCoDto) {

        try {
            validateDates(discountUpdateCoDto.getStartDate(), discountUpdateCoDto.getEndDate());

            UUID discountCode = UUID.fromString(discountUpdateCoDto.getCode());

            Discount discount = discountJpa.findByCode(discountCode)
                    .orElseThrow(() -> new AppException("Discount not found", 400));
            String m = TextNormalizer.removeVietnameseAccents(discountUpdateCoDto.getDiscountCode());
            String s = TextNormalizer.removeWhitespace(m);
            discount.setDiscountCode(s.trim());
            discount.setDiscountType(discountUpdateCoDto.getDiscountType());
            discount.setDescription(discountUpdateCoDto.getDescription());
            discount.setDiscountValue(discountUpdateCoDto.getDiscountValue());
            discount.setMaxDiscount(discountUpdateCoDto.getMaxDiscount());
            discount.setStartDate(discountUpdateCoDto.getStartDate());
            discount.setEndDate(discountUpdateCoDto.getEndDate());
            discount.setIsActive(discountUpdateCoDto.getIsActive());
            discount.setUsageLimit(discountUpdateCoDto.getUsageLimit());

            discount.setUserUpdate(user);

            discountJpa.save(discount);
            return mapToDTO(discount);

        } catch (DataIntegrityViolationException e) {
            // do chỉ có một cột unique nên sài trực tiếp
            throw new AppException("Discount code already exists", 409);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Discount code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating Discount: " + e.getMessage(), 500);
        }
    }

    public DiscountAllDto createDiscountPro(User user, DiscountCreateProDto dto) {
        try {
            UUID productCode = UUID.fromString(dto.getProductCode());

            List<Discount> proDiscounts = discountJpa.findByProductCode(productCode, null);
            for (Discount d : proDiscounts) {
                if (isValid(d.getStartDate(), d.getEndDate())) {
                    throw new AppException("This product already has an active discount applied.", 400);
                }
            }

            validateDates(dto.getStartDate(), dto.getEndDate());

            Product product = productJpa.findByCode(productCode)
                    .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND.value()));

            Discount discount = new Discount();
            discount.setCode(UUID.randomUUID());
            discount.setDiscountType(dto.getDiscountType());
            discount.setDescription(dto.getDescription());
            discount.setDiscountValue(dto.getDiscountValue());
            discount.setMaxDiscount(dto.getMaxDiscount());
            discount.setStartDate(dto.getStartDate());
            discount.setEndDate(dto.getEndDate());
            discount.setIsActive(dto.getIsActive());
            discount.setProduct(product);
            discount.setUserCreate(user);
            discount.setUserUpdate(user);

            discountJpa.save(discount);
            return mapToDTO(discount);

        } catch (Exception e) {
            throw new AppException("An error occurred while creating Discount: " + e.getMessage(), 500);
        }
    }

    public DiscountAllDto updateDiscountPro(User user, DiscountUpdateProDto dto) {
        try {
            UUID productCode = UUID.fromString(dto.getProductCode());
            UUID discountCode = UUID.fromString(dto.getCode());

            List<Discount> proDiscounts = discountJpa.findByProductCode(productCode, discountCode);
            for (Discount d : proDiscounts) {
                if (isValid(d.getStartDate(), d.getEndDate())) {
                    throw new AppException("This product already has an active discount applied.", 400);
                }
            }

            validateDates(dto.getStartDate(), dto.getEndDate());

            Product product = productJpa.findByCode(productCode)
                    .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND.value()));

            Discount discount = discountJpa.findByCode(discountCode)
                    .orElseThrow(() -> new AppException("Discount not found", HttpStatus.NOT_FOUND.value()));

            discount.setDiscountType(dto.getDiscountType());
            discount.setDescription(dto.getDescription());
            discount.setDiscountValue(dto.getDiscountValue());
            discount.setMaxDiscount(dto.getMaxDiscount());
            discount.setStartDate(dto.getStartDate());
            discount.setEndDate(dto.getEndDate());
            discount.setIsActive(dto.getIsActive());
            discount.setProduct(product);
            discount.setUserUpdate(user);

            discountJpa.save(discount);
            return mapToDTO(discount);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Discount code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating Discount: " + e.getMessage(), 500);
        }
    }

    public void deleteDiscount(User user, CodeDto codeDto) {
        try {
            UUID discountCode = UUID.fromString(codeDto.getCode());
            Discount discount = discountJpa.findByCode(discountCode)
                    .orElseThrow(() -> new AppException("Discount not found", HttpStatus.NOT_FOUND.value()));

            discount.softDelete();
            discount.setUserDelete(user);
            discountJpa.save(discount);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Discount code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while delete Discount: " + e.getMessage(), 500);
        }
    }

    public boolean isValid(LocalDateTime startDate, LocalDateTime endDate) {
        // Chưa bắt đầu (tức now < startDate)

        // Hoặc đang còn hạn (tức startDate <= now <= endDate hoặc startDate <= now nếu
        // endDate == null
        LocalDateTime now = LocalDateTime.now();

        if (startDate == null) {
            return false; // startDate là bắt buộc
        }

        // Nếu chưa đến endDate hoặc endDate null (tức là không giới hạn)
        if (endDate == null) {
            return true;
        }

        // Nếu thời gian hiện tại trước hoặc bằng endDate
        return !now.isAfter(endDate);
    }

    public void validateDates(LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime now = LocalDateTime.now();

        if (startDate == null) {
            throw new AppException("Start date must not be null", 400);
        }

        if (startDate.isBefore(now)) {
            throw new AppException("Start date must be in the present or future", 400);
        }

        if (endDate != null && !endDate.isAfter(startDate)) {
            throw new AppException("End date must be after start date", 400);
        }
    }

    private DiscountAllDto mapToDTO(Discount discount) {
        return new DiscountAllDto(discount.getCode().toString(),

                discount.getDiscountCode(),
                discount.getDiscountType(),
                discount.getDescription(),
                discount.getDiscountValue(),
                discount.getMaxDiscount(),
                discount.getStartDate().toString(),
                discount.getEndDate().toString(),
                discount.getIsActive(),
                discount.getUsageLimit(),
                discount.getProduct() != null ? discount.getProduct().getCode().toString() : null,
                discount.getProduct() != null ? discount.getProduct().getName() : null,

                discount.getCreatedAt().toString(),
                discount.getUserCreate().getCode().toString(),
                discount.getUserCreate().getDisplayName(),
                discount.getUpdatedAt().toString(),
                discount.getUserUpdate().getCode().toString(),
                discount.getUserUpdate().getDisplayName());
    }

}
