package com.moe.socialnetwork.api.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.ClientProductDto;
import com.moe.socialnetwork.api.dtos.ClientProductFilterDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IWishListService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.BrandJpa;
import com.moe.socialnetwork.jpa.CategoryJpa;
import com.moe.socialnetwork.jpa.DiscountJpa;
import com.moe.socialnetwork.jpa.ProductJpa;
import com.moe.socialnetwork.jpa.ProductTagJpa;
import com.moe.socialnetwork.jpa.ProductVersionJpa;
import com.moe.socialnetwork.jpa.RatingJpa;
import com.moe.socialnetwork.jpa.TagJpa;
import com.moe.socialnetwork.jpa.WishListJpa;
import com.moe.socialnetwork.models.Discount;
import com.moe.socialnetwork.models.Product;
import com.moe.socialnetwork.models.ProductVersion;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.models.WishList;

@Service
public class WishListServiceImpl implements IWishListService {

    private final ProductJpa productJpa;
    private final DiscountJpa discountJpa;
    private final ProductVersionJpa productVersionJpa;
    private final RatingJpa ratingJpa;
    private final WishListJpa wishListJpa;

    public WishListServiceImpl(ProductJpa productJpa, CategoryJpa categoryJpa, BrandJpa brandJpa,
            ProductTagJpa productTagJpa, TagJpa tagJpa, DiscountJpa discountJpa, ProductVersionJpa productVersionJpa,
            RatingJpa ratingJpa, WishListJpa wishListJpa) {
        this.productJpa = productJpa;
        this.discountJpa = discountJpa;
        this.productVersionJpa = productVersionJpa;
        this.ratingJpa = ratingJpa;
        this.wishListJpa = wishListJpa;
    }

    public PageDto<ClientProductDto> getWishListProductAll(User user, ClientProductFilterDto dto) {
        // Validate and parse sort direction
        Sort.Direction direction = "asc".equalsIgnoreCase(dto.getSort()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getSize(), Sort.by(direction, "id"));

        // Fetch filtered products
        Page<Product> products = wishListJpa.findProductsByUserId(user.getId(), pageable);

        // Fetch user's wishlist for efficient lookup
        List<WishList> wishLists = Collections.emptyList();
        if (user != null) {
            wishLists = wishListJpa.findByUserCode(user.getCode());
        }

        Set<UUID> wishListProductCodes = wishLists.stream()
                .map(wishList -> wishList.getProduct().getCode())
                .collect(Collectors.toSet());

        // Map products to DTOs and enhance with rating and wishlist status
        List<ClientProductDto> contents = products.getContent().stream()
                .map(product -> {
                    ClientProductDto pro = mapToProductDTO(product);
                    // Set average rating
                    Double rating = ratingJpa.getAverageRatingByProductCode(product.getCode());
                    pro.setRating(rating != null ? rating : 0.0);
                    // Set liked status only if user is logged in
                    pro.setLiked(user != null && wishListProductCodes.contains(product.getCode()));

                    List<Discount> discounts = discountJpa.findByProductCode(product.getCode(), null);

                    if (!discounts.isEmpty()) {
                        for (Discount discount : discounts) {
                            if (isValid(discount.getStartDate(), discount.getEndDate())) {
                                pro.setIsDiscount(true);
                                pro.setDiscountValue(discount.getDiscountValue().toString());
                                // Tính số tiền giảm
                                BigDecimal discountPrice = product.getPrice()
                                        .multiply(discount.getDiscountValue())
                                        .divide(BigDecimal.valueOf(100));

                                // Giới hạn số tiền giảm
                                if (discount.getMaxDiscount() != null &&
                                        discountPrice.compareTo(discount.getMaxDiscount()) > 0) {
                                    discountPrice = discount.getMaxDiscount();
                                }

                                // Cập nhật giá sau giảm
                                BigDecimal finalPrice = product.getPrice().subtract(discountPrice);
                                pro.setDiscountPrice(finalPrice);
                                break; // Nếu chỉ áp dụng 1 discount hợp lệ thì thoát luôn
                            }
                        }
                    }

                    return pro;
                })
                .collect(Collectors.toList());

        // Build PageDto
        PageDto<ClientProductDto> pageDto = new PageDto<>();
        pageDto.setContents(contents);
        pageDto.setTotalElements(products.getTotalElements());
        pageDto.setTotalPages(products.getTotalPages());
        pageDto.setPage(products.getNumber());
        pageDto.setSize(products.getSize());
        pageDto.setHasNext(products.hasNext());
        pageDto.setHasPrevious(products.hasPrevious());

        return pageDto;
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

    private ClientProductDto mapToProductDTO(Product product) {

        List<ProductVersion> list = productVersionJpa.findByProductCode(product.getCode());

        String colorOne = list.size() > 0 && list.get(0) != null ? list.get(0).getColor().getName() : null;
        String colorTwo = list.size() > 1 && list.get(1) != null ? list.get(1).getColor().getName() : null;
        String colorThree = list.size() > 2 && list.get(2) != null ? list.get(2).getColor().getName() : null;

        return new ClientProductDto(product.getCode().toString(),
                product.getName(),
                product.getPrice(),
                product.getImage(),
                false,
                0.0,
                colorOne,
                colorTwo,
                colorThree,
                false,
                "",
                BigDecimal.ZERO,
                null,
                null,
                null,
                null,
                null);
    }

 public void toggleWishList(User user, CodeDto codeDto) {
    UUID productCode = UUID.fromString(codeDto.getCode());

    // Kiểm tra xem sản phẩm có tồn tại không
    Product product = productJpa.findByCode(productCode)
            .orElseThrow(() -> new AppException("Product not found", 404));

    // Tìm wishlist hiện tại nếu có
    Optional<WishList> existing = wishListJpa.findByUserCodeAndProductCode(user.getCode(), productCode);

    if (existing.isPresent()) {
        // Nếu có, xóa khỏi wishlist
        wishListJpa.delete(existing.get());
    } else {
        // Nếu chưa có, thêm mới vào wishlist
        WishList wishList = new WishList();
        wishList.setUser(user);
        wishList.setProduct(product);
        wishListJpa.save(wishList);
    }
}

}
