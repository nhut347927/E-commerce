package com.moe.socialnetwork.api.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.BrandAllDto;
import com.moe.socialnetwork.api.dtos.CategoryAllDto;
import com.moe.socialnetwork.api.dtos.ProductAllDto;
import com.moe.socialnetwork.api.dtos.ProductCreateDto;
import com.moe.socialnetwork.api.dtos.ProductUpdateDto;
import com.moe.socialnetwork.api.dtos.TagAllDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IProductService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.BrandJpa;
import com.moe.socialnetwork.jpa.CategoryJpa;
import com.moe.socialnetwork.jpa.ProductJpa;
import com.moe.socialnetwork.jpa.ProductTagJpa;
import com.moe.socialnetwork.jpa.TagJpa;
import com.moe.socialnetwork.models.Brand;
import com.moe.socialnetwork.models.Category;
import com.moe.socialnetwork.models.Product;
import com.moe.socialnetwork.models.ProductTag;
import com.moe.socialnetwork.models.Tag;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class ProductServiceImpl implements IProductService {

    private final ProductJpa productJpa;
    private final CategoryJpa categoryJpa;
    private final BrandJpa brandJpa;
    private final ProductTagJpa productTagJpa;
    private final TagJpa tagJpa;

    public ProductServiceImpl(ProductJpa productJpa, CategoryJpa categoryJpa, BrandJpa brandJpa,
            ProductTagJpa productTagJpa, TagJpa tagJpa) {
        this.productJpa = productJpa;
        this.categoryJpa = categoryJpa;
        this.brandJpa = brandJpa;
        this.productTagJpa = productTagJpa;
        this.tagJpa = tagJpa;
    }

    public List<CategoryAllDto> getCategoryAll() {
        List<Category> categories = categoryJpa.findAll();
        return categories.stream().map(this::mapToDTO).collect(Collectors.toList());

    }

    public List<BrandAllDto> getBrandAll() {
        List<Brand> brand = brandJpa.findAll();
        return brand.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<TagAllDto> getTagAll() {
        List<Tag> tags = tagJpa.findAll();
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

            // 🟢 Đây là chỗ bạn đang nói tới
            productTagJpa.saveAll(productTags);

            return mapToDTO(pr);
        } catch (Exception e) {
            throw new AppException("An error occurred while creating product: " + e.getMessage(), 500);
        }
    };

    public ProductAllDto updateProduct(User user, ProductUpdateDto productUpdateDto) {
        try {
            UUID productCode = UUID.fromString(productUpdateDto.getCode());
            Product product = productJpa.findByCode(productCode)
                    .orElseThrow(() -> new AppException("product not found", HttpStatus.NOT_FOUND.value()));

            UUID categoryCode = UUID.fromString(productUpdateDto.getCategoryCode());
            UUID brandCode = UUID.fromString(productUpdateDto.getBrandCode());
            Category category = categoryJpa.findByCode(categoryCode)
                    .orElseThrow(() -> new AppException("Category not found", 404));
            Brand brand = brandJpa.findByCode(brandCode)
                    .orElseThrow(() -> new AppException("Brand not found", 404));

            product.setName(productUpdateDto.getName());

            product.setPrice(productUpdateDto.getPrice());
            product.setImage(productUpdateDto.getImage());
            product.setShortDescription(productUpdateDto.getShortDescription());
            product.setFullDescription(productUpdateDto.getFullDescription());
            product.setCategory(category);
            product.setBrand(brand);

            product.setUserUpdate(user);
            productJpa.save(product);
            // Chuyển list tagCode từ String -> UUID
            List<UUID> tagCodeUUIDs = productUpdateDto.getListTagCode().stream()
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

            // 🟢 Đây là chỗ bạn đang nói tới
            productTagJpa.saveAll(productTags);

            return mapToDTO(pr);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid product code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating product: " + e.getMessage(), 500);
        }
    };

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
            listTagCode.add(productTag.getCode().toString());
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
}
