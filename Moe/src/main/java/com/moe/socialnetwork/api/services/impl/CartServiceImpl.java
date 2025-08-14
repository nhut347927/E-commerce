package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

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

    public void addToCart(User user, CodeDto codeDto) {
        try {
            UUID productVersionCode = UUID.fromString(codeDto.getCode());

            ProductVersion pv = productVersionJpa.findByCode(productVersionCode)
                    .orElseThrow(() -> new AppException("Product version not found", 404));

            boolean exists = cartJpa.existsByUserIdAndProductVersionId(user.getId(), pv.getId());
            if (exists) {
                throw new AppException("Product version already in cart", 400);
            }

            Cart cart = new Cart();
            cart.setUserCreate(user);
            cart.setProductVersion(pv);
            cart.setQuantity(1);

            cartJpa.save(cart);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid Color code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating Color: " + e.getMessage(), 500);
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

    public List<ProductVersionAllDto> getCartProductVersions(User user) {
        List<ProductVersion> productVersions = cartJpa.findProductVersionsByUserId(user.getId());
        return productVersions.stream()
                .map(this::mapToDTO) // dùng this nếu mapToDTO là method instance
                .collect(Collectors.toList());
    }

    private ProductVersionAllDto mapToDTO(ProductVersion product) {

        return new ProductVersionAllDto(product.getCode().toString(),
                product.getProduct().getName() + " (" + product.getName() + ")",

                product.getQuantity(),
                product.getImage(),
                product.getSize().getCode().toString(),
                product.getColor().getCode().toString(),
                product.getProduct().getCode().toString(),

                "",
                "",
                "",
                "",
                "",
                "");
    }
}
