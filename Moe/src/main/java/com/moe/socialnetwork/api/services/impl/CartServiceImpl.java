package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.ClientCartAllDto;
import com.moe.socialnetwork.api.dtos.ClientCartDto;
import com.moe.socialnetwork.api.dtos.ProductVersionAllDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.services.ICartService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.CartJpa;
import com.moe.socialnetwork.jpa.ProductVersionJpa;
import com.moe.socialnetwork.models.Cart;
import com.moe.socialnetwork.models.ProductVersion;
import com.moe.socialnetwork.models.User;

@Service
public class CartServiceImpl implements ICartService {
    private final CartJpa cartJpa;
    private final ProductVersionJpa productVersionJpa;

    public CartServiceImpl(CartJpa cartJpa, ProductVersionJpa productVersionJpa) {
        this.cartJpa = cartJpa;
        this.productVersionJpa = productVersionJpa;
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
        return productVersions.stream()
                .map(this::mapToDTO) // dùng this nếu mapToDTO là method instance
                .collect(Collectors.toList());
    }

    private ClientCartAllDto mapToDTO(ProductVersion product) {

        return new ClientCartAllDto(product.getCode().toString(),
                product.getProduct().getName() + " (" + product.getName() + ")",

                product.getQuantity(),
                product.getImage(),
                product.getSize().getName(),
                product.getColor().getName(),
                product.getProduct().getPrice());

    }
}
