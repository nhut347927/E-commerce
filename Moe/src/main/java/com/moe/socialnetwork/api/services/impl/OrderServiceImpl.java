package com.moe.socialnetwork.api.services.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.OrderAllDto;
import com.moe.socialnetwork.api.dtos.OrderItemAddDto;
import com.moe.socialnetwork.api.dtos.OrderItemAllDto;
import com.moe.socialnetwork.api.dtos.OrderUpdateDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IOrderService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.DiscountJpa;
import com.moe.socialnetwork.jpa.OrderItemJpa;
import com.moe.socialnetwork.jpa.OrderJpa;
import com.moe.socialnetwork.jpa.ProductVersionJpa;
import com.moe.socialnetwork.models.Discount;
import com.moe.socialnetwork.models.Order;
import com.moe.socialnetwork.models.OrderItem;
import com.moe.socialnetwork.models.ProductVersion;
import com.moe.socialnetwork.models.Order.DeliveryStatus;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

import jakarta.transaction.Transactional;

@Service
public class OrderServiceImpl implements IOrderService {
    private final OrderJpa orderJpa;
    private final OrderItemJpa orderItemJpa;
    private final ProductVersionJpa productVersionJpa;
    private final DiscountJpa discountJpa;

    public OrderServiceImpl(OrderJpa orderJpa, OrderItemJpa orderItemJpa, ProductVersionJpa productVersionJpa,
            DiscountJpa discountJpa) {
        this.orderJpa = orderJpa;
        this.orderItemJpa = orderItemJpa;
        this.productVersionJpa = productVersionJpa;
        this.discountJpa = discountJpa;
    }

    public List<OrderItemAllDto> getOrderItemByOrderCode(CodeDto dto) {
        UUID code = UUID.fromString(dto.getCode());
        List<OrderItem> orderItems = orderItemJpa.findByOrderCode(code);
        List<OrderItemAllDto> contents = orderItems.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return contents;
    }

    public PageDto<OrderAllDto> getOrderAllClient(User user, String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Order> orders = orderJpa.searchByNameAndUserId(user.getId(), query, pageable);

        List<OrderAllDto> contents = orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(orders, contents);

    }

    public List<String> getDeliveryStatuses() {
        return Arrays.stream(DeliveryStatus.values())
                .map(Enum::name)
                .toList();
    }

    public PageDto<OrderAllDto> getOrderAll(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Order> orders = orderJpa.searchByName(query, pageable);

        List<OrderAllDto> contents = orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(orders, contents);

    }

    public OrderAllDto updateOrder(User user, OrderUpdateDto orderUpdateDto) {
        try {
            UUID orderCode = UUID.fromString(orderUpdateDto.getCode());
            Order order = orderJpa.findByCode(orderCode)
                    .orElseThrow(() -> new AppException("Order not found", HttpStatus.NOT_FOUND.value()));

            order.setFirstName(orderUpdateDto.getFirstName());
            order.setLastName(orderUpdateDto.getLastName());
            order.setCountry(orderUpdateDto.getCountry());
            order.setAddress(orderUpdateDto.getAddress());
            order.setTownCity(orderUpdateDto.getTownCity());
            order.setPhone(orderUpdateDto.getPhone());
            order.setEmail(orderUpdateDto.getEmail());

            order.setPaymentMethod(orderUpdateDto.getPaymentMethod());
            order.setDeliveryStatus(orderUpdateDto.getDeliveryStatus());

            order.setUserUpdate(user);
            orderJpa.save(order);
            OrderAllDto orderAllDto = mapToDTO(order);
            return orderAllDto;
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid size code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating order: " + e.getMessage(), 500);
        }
    };

    public List<OrderItemAllDto> getAllOrderItem(CodeDto dto) {
        UUID code = UUID.fromString(dto.getCode());
        List<OrderItem> orderItems = orderItemJpa.findByOrderCode(code);
        List<OrderItemAllDto> contents = orderItems.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return contents;
    }

    @Transactional
    public void addOrderItem(User user, OrderItemAddDto orderUpdateDto) {
        try {
            // 1. Parse và validate UUID
            UUID orderCode = parseUuid(orderUpdateDto.getOrderCode(), "orderCode");
            UUID productCode = parseUuid(orderUpdateDto.getProductVersionCode(), "productVersionCode");

            // 2. Lấy order và productversion
            Order order = orderJpa.findByCode(orderCode)
                    .orElseThrow(() -> new AppException("Order not found", HttpStatus.NOT_FOUND.value()));

            ProductVersion productVersion = productVersionJpa.findByCode(productCode)
                    .orElseThrow(() -> new AppException("Product version not found", HttpStatus.NOT_FOUND.value()));

            // 3. Tìm order item
            OrderItem item = orderItemJpa.findByOrderIdAndProductId(order.getId(), productVersion.getId())
                    .map(existingItem -> {
                        int newQuantity = existingItem.getQuantity() + orderUpdateDto.getQuantity();
                        if (newQuantity > productVersion.getQuantity()) {
                            throw new AppException("Quantity exceeds available stock", HttpStatus.BAD_REQUEST.value());
                        }
                        existingItem.setQuantity(newQuantity);
                        return existingItem;
                    })
                    .orElseGet(() -> {
                        if (orderUpdateDto.getQuantity() > productVersion.getQuantity()) {
                            throw new AppException("Quantity exceeds available stock", HttpStatus.BAD_REQUEST.value());
                        }
                        OrderItem newItem = new OrderItem();
                        newItem.setOrder(order);
                        newItem.setProductVersion(productVersion);
                        newItem.setQuantity(orderUpdateDto.getQuantity());
                        newItem.setPrice(getFinalPrice(productVersion));
                        newItem.setUserCreate(user);
                        return newItem;
                    });

            // 4. Lưu order item
            orderItemJpa.save(item);

            // 5. Tính lại tổng đơn hàng
            recalculateOrderTotals(order);

        } catch (AppException e) {
            throw e; // ném lại để client nhận lỗi
        } catch (Exception e) {
            throw new AppException(
                    "An error occurred while updating order: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    // Hàm parse UUID có thông báo lỗi rõ ràng
    private UUID parseUuid(String uuidStr, String fieldName) {
        try {
            return UUID.fromString(uuidStr);
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid UUID format for " + fieldName, HttpStatus.BAD_REQUEST.value());
        }
    }

    public void deleteOrderItem(CodeDto dto) {
        try {
            UUID orderCode = UUID.fromString(dto.getCode());
            OrderItem orderItem = orderItemJpa.findByCode(orderCode)
                    .orElseThrow(() -> new AppException("Order Item not found", HttpStatus.NOT_FOUND.value()));
            Order order = orderItem.getOrder();
            List<OrderItem> orderItems = orderItemJpa.findByOrderCode(order.getCode());
            if (orderItems.size() <= 1) {
                throw new AppException("Order must contain at least one item. Cannot delete the last item.",
                        HttpStatus.BAD_REQUEST.value());
            }
            orderItemJpa.delete(orderItem);
            // ############################
            recalculateOrderTotals(order);
            // ############################
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid size code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating order: " + e.getMessage(), 500);
        }
    };

    public void recalculateOrderTotals(Order order) {
        List<OrderItem> orderItems = orderItemJpa.findByOrderCode(order.getCode());

        if (orderItems == null || orderItems.isEmpty()) {
            order.setQuantity(0);
            order.setPrice(BigDecimal.ZERO);
            order.setDiscountAmount(BigDecimal.ZERO);
            order.setTotal(BigDecimal.ZERO);
            orderJpa.save(order);
            return;
        }

        int totalQuantity = orderItems.stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();

        BigDecimal tongGiaSanPham = orderItems.stream()
                .filter(item -> item.getPrice() != null)
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setQuantity(totalQuantity);
        order.setPrice(tongGiaSanPham);

        BigDecimal giaGiam = BigDecimal.ZERO;
        if (order.getDiscount() != null && order.getDiscount().getDiscountValue() != null
                && isValid(order.getDiscount().getStartDate(), order.getDiscount().getEndDate())) {
            BigDecimal discountValue = order.getDiscount().getDiscountValue();
            if (discountValue.compareTo(BigDecimal.ZERO) >= 0
                    && discountValue.compareTo(BigDecimal.valueOf(100)) <= 0) {
                giaGiam = tongGiaSanPham.multiply(discountValue)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                // So sánh với maxDiscount
                BigDecimal maxDiscount = order.getDiscount().getMaxDiscount();
                if (maxDiscount != null && giaGiam.compareTo(maxDiscount) > 0) {
                    giaGiam = maxDiscount;
                }
            }
        }
        order.setDiscountAmount(giaGiam);

        BigDecimal phiVanChuyen = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;

        BigDecimal tongCuoiCung = tongGiaSanPham.add(phiVanChuyen).subtract(giaGiam);
        order.setTotal(tongCuoiCung);

        orderJpa.save(order);
    }

    private OrderAllDto mapToDTO(Order order) {
        String discountDisplay = null;
        if (order.getDiscount() != null && order.getDiscount().getDiscountValue() != null) {
            BigDecimal val = order.getDiscount().getDiscountValue().stripTrailingZeros();
            String valStr = val.scale() <= 0 ? val.toPlainString() : val.toString();
            discountDisplay = order.getDiscount().getDiscountCode() + "(" + valStr + "%)";
        }

        return new OrderAllDto(order.getCode().toString(),
                order.getQuantity(),
                order.getPrice(),
                order.getDiscountAmount(),
                order.getShippingFee(),
                order.getTotal(),

                order.getFirstName(),
                order.getLastName(),
                order.getCountry(),
                order.getAddress(),
                order.getTownCity(),
                order.getPhone(),
                order.getEmail(),
                order.getNotes(),
                order.getPaymentMethod(),
                order.getReason(),
                discountDisplay,
                order.getDeliveryStatus().toString(),

                order.getCreatedAt().toString(),
                order.getUserCreate() != null ? order.getUserCreate().getCode().toString() : null,
                order.getUserCreate() != null ? order.getUserCreate().getDisplayName() : null,
                order.getUpdatedAt().toString(),
                order.getUserUpdate() != null ? order.getUserUpdate().getCode().toString() : null,
                order.getUserUpdate() != null ? order.getUserUpdate().getDisplayName() : null);
    }

    private OrderItemAllDto mapToDTO(OrderItem order) {
        return new OrderItemAllDto(order.getCode().toString(),
                order.getProductVersion().getProduct().getName(),
                order.getProductVersion().getSize().getName(),
                order.getProductVersion().getColor().getName(),
                order.getProductVersion().getImage(),
                order.getQuantity(),
                order.getPrice(),
                order.getCreatedAt().toString(),
                order.getUserCreate() != null ? order.getUserCreate().getCode().toString() : null,
                order.getUserCreate() != null ? order.getUserCreate().getDisplayName() : null,
                order.getRating() != null ? order.getRating() : false);
    }

    private boolean isValid(LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime now = LocalDateTime.now();

        // Nếu startDate sau thời điểm hiện tại => chưa có hiệu lực
        if (startDate.isAfter(now)) {
            return false;
        }

        // Nếu endDate null => không có hạn kết thúc => luôn hợp lệ sau startDate
        if (endDate == null) {
            return true;
        }

        // Nếu endDate >= hiện tại => còn hạn
        return !endDate.isBefore(now);
    }

    private BigDecimal getFinalPrice(ProductVersion productVersion) {
        BigDecimal discountPrice = BigDecimal.ZERO; // Số tiền giảm
        BigDecimal finalPrice = productVersion.getProduct().getPrice(); // Giá sau giảm (mặc định là giá gốc)

        List<Discount> discounts = discountJpa.findByProductCode(productVersion.getProduct().getCode(), null);

        if (!discounts.isEmpty()) {
            for (Discount discount : discounts) {
                if (isValid(discount.getStartDate(), discount.getEndDate())) {

                    // Tính số tiền giảm
                    discountPrice = productVersion.getProduct().getPrice()
                            .multiply(discount.getDiscountValue())
                            .divide(BigDecimal.valueOf(100));

                    // Giới hạn số tiền giảm
                    if (discount.getMaxDiscount() != null &&
                            discountPrice.compareTo(discount.getMaxDiscount()) > 0) {
                        discountPrice = discount.getMaxDiscount();
                    }

                    // Cập nhật giá sau giảm
                    finalPrice = productVersion.getProduct().getPrice().subtract(discountPrice);
                    break; // Nếu chỉ áp dụng 1 discount hợp lệ thì thoát luôn
                }
            }
        }
        return finalPrice;
    }
}
