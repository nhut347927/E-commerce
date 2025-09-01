package com.moe.ecommerce.api.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moe.ecommerce.api.dtos.BrandAllDto;
import com.moe.ecommerce.api.dtos.CategoryAllDto;
import com.moe.ecommerce.api.dtos.ClientProductDto;
import com.moe.ecommerce.api.dtos.ClientProductFilterDto;
import com.moe.ecommerce.api.dtos.ProductAllBasicDto;
import com.moe.ecommerce.api.dtos.ProductAllDto;
import com.moe.ecommerce.api.dtos.ProductCreateDto;
import com.moe.ecommerce.api.dtos.ProductUpdateDto;
import com.moe.ecommerce.api.dtos.TagAllDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.api.services.IProductService;
import com.moe.ecommerce.exception.AppException;
import com.moe.ecommerce.jpa.BrandJpa;
import com.moe.ecommerce.jpa.CategoryJpa;
import com.moe.ecommerce.jpa.DiscountJpa;
import com.moe.ecommerce.jpa.ProductJpa;
import com.moe.ecommerce.jpa.ProductTagJpa;
import com.moe.ecommerce.jpa.ProductVersionJpa;
import com.moe.ecommerce.jpa.RatingJpa;
import com.moe.ecommerce.jpa.TagJpa;
import com.moe.ecommerce.jpa.WishListJpa;
import com.moe.ecommerce.models.Brand;
import com.moe.ecommerce.models.Category;
import com.moe.ecommerce.models.Discount;
import com.moe.ecommerce.models.Product;
import com.moe.ecommerce.models.ProductTag;
import com.moe.ecommerce.models.ProductVersion;
import com.moe.ecommerce.models.Tag;
import com.moe.ecommerce.models.User;
import com.moe.ecommerce.models.WishList;
import com.moe.ecommerce.util.PaginationUtils;

@Service
public class ProductServiceImpl implements IProductService {

    private final ProductJpa productJpa;
    private final CategoryJpa categoryJpa;
    private final BrandJpa brandJpa;
    private final ProductTagJpa productTagJpa;
    private final TagJpa tagJpa;
    private final DiscountJpa discountJpa;
    private final ProductVersionJpa productVersionJpa;
    private final RatingJpa ratingJpa;
    private final WishListJpa wishListJpa;

    public ProductServiceImpl(ProductJpa productJpa, CategoryJpa categoryJpa, BrandJpa brandJpa,
            ProductTagJpa productTagJpa, TagJpa tagJpa, DiscountJpa discountJpa, ProductVersionJpa productVersionJpa,
            RatingJpa ratingJpa, WishListJpa wishListJpa) {
        this.productJpa = productJpa;
        this.categoryJpa = categoryJpa;
        this.brandJpa = brandJpa;
        this.productTagJpa = productTagJpa;
        this.tagJpa = tagJpa;
        this.discountJpa = discountJpa;
        this.productVersionJpa = productVersionJpa;
        this.ratingJpa = ratingJpa;
        this.wishListJpa = wishListJpa;
    }

    public ClientProductDto getClientProduct(User user, CodeDto codeDto) {

        UUID productCode = UUID.fromString(codeDto.getCode());
        // Fetch filtered products
        Product product = productJpa.findByCode(productCode)
                .orElseThrow(() -> new AppException("product not found", HttpStatus.NOT_FOUND.value()));

        // Fetch user's wishlist for efficient lookup
        List<WishList> wishLists = Collections.emptyList();
        if (user != null) {
            wishLists = wishListJpa.findByUserCode(user.getCode());
        }

        Set<UUID> wishListProductCodes = wishLists.stream()
                .map(wishList -> wishList.getProduct().getCode())
                .collect(Collectors.toSet());

        // Map products to DTOs and enhance with rating and wishlist status
        ClientProductDto pro = mapToProductPlusDTO(product);

        // Set average rating
        Double rating = ratingJpa.getAverageRatingByProductCode(product.getCode());
        pro.setRating(rating != null ? rating : 0.0);
        // Set liked status only if user is logged in
        pro.setLiked(user != null && wishListProductCodes.contains(product.getCode()));

        List<Tag> tags = productTagJpa.findTagsByProductCode(product.getCode());

        List<String> listTags = tags.stream().map(t -> t.getName()).collect(Collectors.toList());
        pro.setTags(listTags);
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
    }

    private ClientProductDto mapToProductPlusDTO(Product product) {

        List<ProductVersion> list = productVersionJpa.findByProductCode(product.getCode());

        String colorOne = list.size() > 0 && list.get(0) != null ? list.get(0).getColor().getName() : null;
        String colorTwo = list.size() > 1 && list.get(1) != null ? list.get(1).getColor().getName() : null;
        String colorThree = list.size() > 2 && list.get(2) != null ? list.get(2).getColor().getName() : null;

        List<ClientProductDto.VersionDto> dtoList = new ArrayList<>();

        // Thêm version mặc định từ product
        ClientProductDto.VersionDto cp = new ClientProductDto.VersionDto();
        cp.setCode(null);
        cp.setImage(product.getImage());
        dtoList.add(cp);

        // Thêm các version từ list
        List<ClientProductDto.VersionDto> versions = list.stream()
                .map(p -> new ClientProductDto.VersionDto(
                        p.getCode().toString(),
                        p.getImage(),
                        String.valueOf(p.getQuantity()),
                        p.getColor().getName(),
                        p.getSize().getName()))
                .collect(Collectors.toList());

        // Nối vào danh sách chính
        dtoList.addAll(versions);

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
                product.getShortDescription(),
                product.getFullDescription(),
                dtoList,
                product.getCategory().getName(),
                null);
    }

    public PageDto<ClientProductDto> getClientProductAll(User user, ClientProductFilterDto dto) {
        // Validate and parse sort direction
        Sort.Direction direction = "asc".equalsIgnoreCase(dto.getSort()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getSize(), Sort.by(direction, "price"));

        // Safely parse UUIDs with null checks
        UUID categoryCode = null;
        if (dto.getCategoryCode() != null && !dto.getCategoryCode().isEmpty()) {
            try {
                categoryCode = UUID.fromString(dto.getCategoryCode());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid category code format: " + dto.getCategoryCode());
            }
        }

        UUID brandCode = null;
        if (dto.getBrandCode() != null && !dto.getBrandCode().isEmpty()) {
            try {
                brandCode = UUID.fromString(dto.getBrandCode());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid brand code format: " + dto.getBrandCode());
            }
        }

        UUID sizeCode = null;
        if (dto.getSizeCode() != null && !dto.getSizeCode().isEmpty()) {
            try {
                sizeCode = UUID.fromString(dto.getSizeCode());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid size code format: " + dto.getSizeCode());
            }
        }

        UUID colorCode = null;
        if (dto.getColorCode() != null && !dto.getColorCode().isEmpty()) {
            try {
                colorCode = UUID.fromString(dto.getColorCode());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid color code format: " + dto.getColorCode());
            }
        }

        UUID tagCode = null;
        if (dto.getTagCode() != null && !dto.getTagCode().isEmpty()) {
            try {
                tagCode = UUID.fromString(dto.getTagCode());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid tag code format: " + dto.getTagCode());
            }
        }

        // Fetch filtered products
        Page<Product> products = productJpa.filterProducts(
                dto.getQ(),
                categoryCode,
                brandCode,
                dto.getMinPrice(),
                dto.getMaxPrice(),
                sizeCode,
                colorCode,
                tagCode,
                pageable);

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
                null, null);
    }

    public PageDto<ProductAllBasicDto> getProductAllBasic(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Product> products = productJpa.searchByName(query, pageable);

        List<ProductAllBasicDto> contents = products.stream()
                .map(this::mapToDTOBasic)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(products, contents);

    }

    public List<CategoryAllDto> getCategoryAll() {
        List<Category> categories = categoryJpa.findAll();
        for(Category c : categories){
            if(c.getIsDeleted()){
             categories.remove(c);
            }
         }
        return categories.stream().map(this::mapToDTO).collect(Collectors.toList());

    }

    public List<BrandAllDto> getBrandAll() {
        List<Brand> brand = brandJpa.findAll();
        for(Brand b : brand){
            if(b.getIsDeleted()){
             brand.remove(b);
            }
         }
        return brand.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<TagAllDto> getTagAll() {
        List<Tag> tags = tagJpa.findAll();
        for(Tag t : tags){
            if(t.getIsDeleted()){
             tags.remove(t);
            }
         }
        return tags.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ProductAllDto getProduct(CodeDto codeDto) {

        UUID productCode = UUID.fromString(codeDto.getCode());
        Product product = productJpa.findByCode(productCode)
                .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND.value()));

        return mapToDTO(product);

    }

    public PageDto<ProductAllDto> getProductAll(String query, int page, int size, String sort) {

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Product> products = productJpa.searchByName(query, pageable);

        List<ProductAllDto> contents = products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(products, contents);

    }

    public ProductAllDto createProduct(User user, ProductCreateDto productCreateDto) {
        try {
            UUID categoryCode = UUID.fromString(productCreateDto.getCategoryCode());
            UUID brandCode = UUID.fromString(productCreateDto.getBrandCode());
            Category category = categoryJpa.findByCode(categoryCode)
                    .orElseThrow(() -> new AppException("Category not found", 404));
            Brand brand = brandJpa.findByCode(brandCode)
                    .orElseThrow(() -> new AppException("Brand not found", 404));

            Product product = new Product();
            product.setName(productCreateDto.getName());

            product.setPrice(productCreateDto.getPrice());
            product.setImage(productCreateDto.getImage());
            product.setShortDescription(productCreateDto.getShortDescription());
            product.setFullDescription(productCreateDto.getFullDescription());
            product.setCategory(category);
            product.setBrand(brand);

            product.setUserCreate(user);
            product.setUserUpdate(user);

            // Chuyển list tagCode từ String -> UUID
            List<UUID> tagCodeUUIDs = productCreateDto.getListTagCode().stream()
                    .map(UUID::fromString)
                    .collect(Collectors.toList());

            // Lọc các tag từ DB phù hợp với code
            List<Tag> tagOfProduct = tagJpa.findAll().stream()
                    .filter(tag -> tagCodeUUIDs.contains(tag.getCode()))
                    .collect(Collectors.toList());

            // Lưu sản phẩm
            Product pr = productJpa.save(product);

            // Tạo list ProductTag và lưu
            List<ProductTag> productTags = new ArrayList<>();
            for (Tag tag : tagOfProduct) {
                ProductTag productTag = new ProductTag();
                productTag.setProduct(pr);
                productTag.setTag(tag);
                productTags.add(productTag);
            }

            productTagJpa.saveAll(productTags);

            return mapToDTO(pr);
        } catch (Exception e) {
            throw new AppException("An error occurred while creating product: " + e.getMessage(), 500);
        }
    };

    @Transactional
    public ProductAllDto updateProduct(User user, ProductUpdateDto productUpdateDto) {
        try {
            UUID productCode = UUID.fromString(productUpdateDto.getCode());
            Product product = productJpa.findByCode(productCode)
                    .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND.value()));

            UUID categoryCode = UUID.fromString(productUpdateDto.getCategoryCode());
            UUID brandCode = UUID.fromString(productUpdateDto.getBrandCode());
            Category category = categoryJpa.findByCode(categoryCode)
                    .orElseThrow(() -> new AppException("Category not found", 404));
            Brand brand = brandJpa.findByCode(brandCode)
                    .orElseThrow(() -> new AppException("Brand not found", 404));

            // Cập nhật thông tin sản phẩm
            product.setName(productUpdateDto.getName());
            product.setPrice(productUpdateDto.getPrice());
            product.setImage(productUpdateDto.getImage());
            product.setShortDescription(productUpdateDto.getShortDescription());
            product.setFullDescription(productUpdateDto.getFullDescription());
            product.setCategory(category);
            product.setBrand(brand);
            product.setUserUpdate(user);
            Product pr = productJpa.save(product); // lưu và nhận lại object đã cập nhật

            // ==================== TAG XỬ LÝ ====================

            // 1. Chuyển list tagCode từ String -> UUID
            List<UUID> tagCodeUUIDs = productUpdateDto.getListTagCode().stream()
                    .map(UUID::fromString)
                    .collect(Collectors.toList());

            // 2. Lấy tất cả tag tương ứng trong DB
            List<Tag> selectedTags = tagJpa.findAll().stream()
                    .filter(tag -> tagCodeUUIDs.contains(tag.getCode()))
                    .collect(Collectors.toList());

            // 3. Lấy danh sách tag đã gán hiện tại
            List<ProductTag> existingProductTags = productTagJpa.findByProductCode(pr.getCode());
            Set<UUID> existingTagIds = existingProductTags.stream()
                    .map(pt -> pt.getTag().getCode())
                    .collect(Collectors.toSet());

            // 4. Xóa những tag không còn được chọn
            List<ProductTag> tagsToRemove = existingProductTags.stream()
                    .filter(pt -> !tagCodeUUIDs.contains(pt.getTag().getCode()))
                    .collect(Collectors.toList());
            productTagJpa.deleteAll(tagsToRemove);

            // 5. Thêm các tag mới chưa có
            List<ProductTag> tagsToAdd = selectedTags.stream()
                    .filter(tag -> !existingTagIds.contains(tag.getCode()))
                    .map(tag -> {
                        ProductTag pt = new ProductTag();
                        pt.setProduct(pr);
                        pt.setTag(tag);
                        return pt;
                    })
                    .collect(Collectors.toList());
            productTagJpa.saveAll(tagsToAdd);

            // ==================== KẾT THÚC TAG XỬ LÝ ====================

            return mapToDTO(pr);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid product code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating product: " + e.getMessage(), 500);
        }
    }

    public void deleteProduct(User user, CodeDto codeDto) {
        try {
            UUID productCode = UUID.fromString(codeDto.getCode());
            Product product = productJpa.findByCode(productCode)
                    .orElseThrow(() -> new AppException("product not found", HttpStatus.NOT_FOUND.value()));

            product.softDelete();
            product.setUserDelete(user);
            productJpa.save(product);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid product code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while delete product: " + e.getMessage(), 500);
        }
    }

    private ProductAllDto mapToDTO(Product product) {
        List<String> listTagCode = new ArrayList<>();
        List<ProductTag> productTagList = productTagJpa.findByProductCode(product.getCode());

        for (ProductTag productTag : productTagList) {
            listTagCode.add(productTag.getTag().getCode().toString());
        }

        return new ProductAllDto(product.getCode().toString(),
                product.getName(),

                product.getPrice(),
                product.getImage(),
                product.getShortDescription(),
                product.getFullDescription(),
                product.getCategory().getCode().toString(),
                product.getBrand().getCode().toString(),
                listTagCode,

                product.getCreatedAt().toString(),
                product.getUserCreate().getCode().toString(),
                product.getUserCreate().getDisplayName(),
                product.getUpdatedAt().toString(),
                product.getUserUpdate().getCode().toString(),
                product.getUserUpdate().getDisplayName());
    }

    private CategoryAllDto mapToDTO(Category category) {
        return new CategoryAllDto(category.getCode().toString(),
                category.getName(),
                category.getCreatedAt().toString(),
                category.getUserCreate().getCode().toString(),
                category.getUserCreate().getDisplayName(),
                category.getUpdatedAt().toString(),
                category.getUserUpdate().getCode().toString(),
                category.getUserUpdate().getDisplayName());
    }

    private BrandAllDto mapToDTO(Brand brand) {
        return new BrandAllDto(brand.getCode().toString(),
                brand.getName(),
                brand.getCreatedAt().toString(),
                brand.getUserCreate().getCode().toString(),
                brand.getUserCreate().getDisplayName(),
                brand.getUpdatedAt().toString(),
                brand.getUserUpdate().getCode().toString(),
                brand.getUserUpdate().getDisplayName());
    }

    private TagAllDto mapToDTO(Tag tag) {
        return new TagAllDto(tag.getCode().toString(),
                tag.getName(),
                tag.getCreatedAt().toString(),
                tag.getUserCreate().getCode().toString(),
                tag.getUserCreate().getDisplayName(),
                tag.getUpdatedAt().toString(),
                tag.getUserUpdate().getCode().toString(),
                tag.getUserUpdate().getDisplayName());
    }

    private ProductAllBasicDto mapToDTOBasic(Product product) {
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

        return new ProductAllBasicDto(
                product.getCode().toString(),
                product.getName(),
                product.getImage(),
                product.getPrice(),
                finalPrice);
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
