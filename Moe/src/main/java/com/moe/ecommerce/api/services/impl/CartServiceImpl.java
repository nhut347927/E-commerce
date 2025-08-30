package com.moe.ecommerce.api.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.ecommerce.api.dtos.ClientCartAllDto;
import com.moe.ecommerce.api.dtos.ClientCartDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.services.ICartService;
import com.moe.ecommerce.exception.AppException;
import com.moe.ecommerce.jpa.CartJpa;
import com.moe.ecommerce.jpa.DiscountJpa;
import com.moe.ecommerce.jpa.ProductVersionJpa;
import com.moe.ecommerce.models.Cart;
import com.moe.ecommerce.models.Discount;
import com.moe.ecommerce.models.ProductVersion;
import com.moe.ecommerce.models.User;

@Service
public class CartServiceImpl implements ICartService {
    private final CartJpa cartJpa;
    private final ProductVersionJpa productVersionJpa;
    private final DiscountJpa discountJpa;

    public CartServiceImpl(CartJpa cartJpa, ProductVersionJpa productVersionJpa, DiscountJpa discountJpa) {
        this.cartJpa = cartJpa;
        this.productVersionJpa = productVersionJpa;
        this.discountJpa = discountJpa;
    }

    public void updateQuantity(User user, String pvCode, int quantity) {
        try {
            UUID productVersionCode = UUID.fromString(pvCode);

            ProductVersion pv = productVersionJpa.findByCode(productVersionCode)
                    .orElseThrow(() -> new AppException("Product version not found", 404));

            Cart cart = cartJpa.findByUserCodeAndProductVersionCode(user.getCode(), pv.getCode())
                    .orElseThrow(() -> new AppException("Cart item not found", 404));

            // Kiểm tra số lượng hợp lệ
            if (quantity <= 0) {
                throw new AppException("Quantity must be greater than 0", 400);
            }

            if (quantity > pv.getQuantity()) {
                throw new AppException("Quantity exceeds available stock", 400);
            }

            // Cập nhật số lượng
            cart.setQuantity(quantity);
            cartJpa.save(cart);
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid product code format", HttpStatus.BAD_REQUEST.value());
        } catch (AppException e) {
            throw e; // ném lại để thông báo lỗi đến client
        } catch (Exception e) {
            throw new AppException("An error occurred while updating cart: " + e.getMessage(), 500);
        }
    }

    public void addToCart(User user, ClientCartDto request) {
        try {
            UUID productVersionCode = UUID.fromString(request.getCode());

            ProductVersion pv = productVersionJpa.findByCode(productVersionCode)
                    .orElseThrow(() -> new AppException("Product version not found", 404));

            Optional<Cart> existingCartOpt = cartJpa.findByUserCodeAndProductVersionCode(user.getCode(), pv.getCode());

            if (existingCartOpt.isPresent()) {
                Cart existingCart = existingCartOpt.get();
                int newQuantity = existingCart.getQuantity() + request.getQuantity();

                if (newQuantity > pv.getQuantity()) {
                    throw new AppException("Quantity exceeds available stock", 400);
                }

                existingCart.setQuantity(newQuantity);
                cartJpa.save(existingCart);
            } else {
                int quantity = request.getQuantity();
                if (quantity > pv.getQuantity()) {
                    throw new AppException("Quantity exceeds available stock", 400);
                }

                Cart newCart = new Cart();
                newCart.setUserCreate(user);
                newCart.setProductVersion(pv);
                newCart.setQuantity(quantity);
                cartJpa.save(newCart);
            }

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid product code format", HttpStatus.BAD_REQUEST.value());
        } catch (AppException e) {
            throw e; // ném lại để thông báo lỗi đến client
        } catch (Exception e) {
            throw new AppException("An error occurred while updating cart: " + e.getMessage(), 500);
        }
    }

    public void deleteFromCart(User user, CodeDto codeDto) {
        try {
            UUID productVersionCode = UUID.fromString(codeDto.getCode());

            Cart cart = cartJpa.findByUserCodeAndProductVersionCode(user.getCode(), productVersionCode)
                    .orElseThrow(() -> new AppException("Cart item not found", 404));

            cartJpa.delete(cart);
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Color code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating Color: " + e.getMessage(), 500);
        }
    }

    public List<ClientCartAllDto> getCartProductVersions(User user) {
        List<ProductVersion> productVersions = cartJpa.findProductVersionsByUserId(user.getId());
        List<Cart> carts = cartJpa.findCartByUserId(user.getId());

        // Tạo map để tra cứu quantity từ carts dựa trên productVersion code
        Map<String, Integer> cartQuantityMap = carts.stream()
                .collect(Collectors.toMap(
                        cart -> cart.getProductVersion().getCode().toString(), // Lấy code từ ProductVersion
                        cart -> cart.getQuantity(), // Lấy quantity từ Cart
                        (existing, replacement) -> existing // Trong trường hợp trùng lặp, giữ giá trị đầu tiên
                ));

        // Map productVersions sang ClientCartAllDto và đắp quantity từ cartQuantityMap
        List<ClientCartAllDto> cartAllDtos = productVersions.stream()
                .map(productVersion -> {
                    ClientCartAllDto dto = mapToDTO(productVersion);
                    // Đắp quantity từ cartQuantityMap, mặc định là 1 nếu không tìm thấy
                    dto.setQuantity(cartQuantityMap.getOrDefault(productVersion.getCode().toString(), 1));
                    return dto;
                })
                .collect(Collectors.toList());

        return cartAllDtos;
    }

    private ClientCartAllDto mapToDTO(ProductVersion productVersion) {
        BigDecimal price = productVersion.getProduct().getPrice();
        List<Discount> discounts = discountJpa.findByProductCode(productVersion.getProduct().getCode(), null);

        if (!discounts.isEmpty()) {
            for (Discount discount : discounts) {
                if (isValid(discount.getStartDate(), discount.getEndDate())) {
                    // Tính số tiền giảm
                    BigDecimal discountPrice = productVersion.getProduct().getPrice()
                            .multiply(discount.getDiscountValue())
                            .divide(BigDecimal.valueOf(100));

                    // Giới hạn số tiền giảm
                    if (discount.getMaxDiscount() != null &&
                            discountPrice.compareTo(discount.getMaxDiscount()) > 0) {
                        discountPrice = discount.getMaxDiscount();
                    }

                    // Cập nhật giá sau giảm
                    BigDecimal finalPrice = productVersion.getProduct().getPrice().subtract(discountPrice);
                    price = finalPrice;
                    break; // Nếu chỉ áp dụng 1 discount hợp lệ thì thoát luôn
                }
            }
        }
        return new ClientCartAllDto(productVersion.getCode().toString(),
                productVersion.getProduct().getName() + " (" + productVersion.getName() + ")",

                0,
                productVersion.getImage(),
                productVersion.getSize().getName(),
                productVersion.getColor().getName(),
                price);

    }

    public boolean isValid(LocalDateTime startDate, LocalDateTime endDate) {
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

}
