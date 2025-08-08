package com.moe.socialnetwork.api.services.impl;

import java.math.BigDecimal;
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
import com.moe.socialnetwork.jpa.ProductJpa;
import com.moe.socialnetwork.models.Discount;
import com.moe.socialnetwork.models.Order;
import com.moe.socialnetwork.models.OrderItem;
import com.moe.socialnetwork.models.Product;
import com.moe.socialnetwork.models.Order.DeliveryStatus;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class OrderServiceImpl implements IOrderService {
    private final OrderJpa orderJpa;
    private final OrderItemJpa orderItemJpa;
    private final ProductJpa productJpa;
    private final DiscountJpa discountJpa;

    public OrderServiceImpl(OrderJpa orderJpa, OrderItemJpa orderItemJpa, ProductJpa productJpa,
            DiscountJpa discountJpa) {
        this.orderJpa = orderJpa;
        this.orderItemJpa = orderItemJpa;
        this.productJpa = productJpa;
        this.discountJpa = discountJpa;
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

    public void addOrderItem(User user, OrderItemAddDto orderUpdateDto) {
        try {
            UUID orderCode = UUID.fromString(orderUpdateDto.getOrderCode());
            Order order = orderJpa.findByCode(orderCode)
                    .orElseThrow(() -> new AppException("Order not found", HttpStatus.NOT_FOUND.value()));
            UUID productCode = UUID.fromString(orderUpdateDto.getProductCode());
            Product product = productJpa.findByCode(productCode)
                    .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND.value()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(orderUpdateDto.getQuantity());
            orderItem.setPrice(getFinalPrice(product));
            orderItemJpa.save(orderItem);
            // ############################
            recalculateOrderTotals(order);
            // ############################
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid size code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating order: " + e.getMessage(), 500);
        }
    };

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
        try {
            BigDecimal tongGiaSanPham = BigDecimal.ZERO;
            BigDecimal giaGiam = BigDecimal.ZERO;
            BigDecimal tongCuoiCung;

            // Lấy danh sách sản phẩm trong order
            List<OrderItem> orderItems = orderItemJpa.findByOrderCode(order.getCode());

            // Cộng tổng giá tất cả sản phẩm
            for (OrderItem orderItem : orderItems) {
                if (orderItem.getPrice() != null) {
                    tongGiaSanPham = tongGiaSanPham.add(orderItem.getPrice());
                }
            }
            order.setPrice(tongGiaSanPham);

            // Tính tiền giảm giá (nếu có discount)
            if (order.getDiscount() != null && order.getDiscount().getDiscountValue() != null) {
                giaGiam = tongGiaSanPham
                        .multiply(order.getDiscount().getDiscountValue())
                        .divide(BigDecimal.valueOf(100));
                order.setDiscountAmount(giaGiam);
            } else {
                order.setDiscountAmount(BigDecimal.ZERO);
            }

            // Phí vận chuyển (nếu null thì = 0)
            BigDecimal phiVanChuyen = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;

            // Tổng cuối cùng = Tổng giá sản phẩm + Phí vận chuyển - Giảm giá
            tongCuoiCung = tongGiaSanPham.add(phiVanChuyen).subtract(giaGiam);
            order.setTotal(tongCuoiCung);

            // Lưu lại order
            orderJpa.save(order);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid size code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating order: " + e.getMessage(), 500);
        }
    }

    private OrderAllDto mapToDTO(Order order) {
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
                order.getDiscount() == null ? order.getDiscount().getDiscountCode() : null,
                order.getDeliveryStatus().toString(),

                order.getCreatedAt().toString(),
                order.getUserCreate().getCode().toString(),
                order.getUserCreate().getDisplayName(),
                order.getUpdatedAt().toString(),
                order.getUserUpdate().getCode().toString(),
                order.getUserUpdate().getDisplayName());
    }

    private OrderItemAllDto mapToDTO(OrderItem order) {
        return new OrderItemAllDto(order.getCode().toString(),
                order.getProduct().getName(),
                order.getProduct().getImage(),
                order.getQuantity(),
                order.getPrice(),

                order.getCreatedAt().toString(),
                order.getUserCreate().getCode().toString(),
                order.getUserCreate().getDisplayName());
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

    private BigDecimal getFinalPrice(Product product) {
        BigDecimal discountPrice = BigDecimal.ZERO; // Số tiền giảm
        BigDecimal finalPrice = product.getPrice(); // Giá sau giảm (mặc định là giá gốc)

        List<Discount> discounts = discountJpa.findByProductCode(product.getCode(), null);

        if (!discounts.isEmpty()) {
            for (Discount discount : discounts) {
                if (isValid(discount.getStartDate(), discount.getEndDate())) {

                    // Tính số tiền giảm
                    discountPrice = product.getPrice()
                            .multiply(discount.getDiscountValue())
                            .divide(BigDecimal.valueOf(100));

                    // Giới hạn số tiền giảm
                    if (discount.getMaxDiscount() != null &&
                            discountPrice.compareTo(discount.getMaxDiscount()) > 0) {
                        discountPrice = discount.getMaxDiscount();
                    }

                    // Cập nhật giá sau giảm
                    finalPrice = product.getPrice().subtract(discountPrice);
                    break; // Nếu chỉ áp dụng 1 discount hợp lệ thì thoát luôn
                }
            }
        }
        return finalPrice;
    }
}
