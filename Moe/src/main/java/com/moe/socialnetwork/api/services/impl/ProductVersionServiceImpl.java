package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.ColorAllDto;
import com.moe.socialnetwork.api.dtos.ProductVersionAllDto;
import com.moe.socialnetwork.api.dtos.ProductVersionCreateDto;
import com.moe.socialnetwork.api.dtos.ProductVersionUpdateDto;
import com.moe.socialnetwork.api.dtos.SizeAllDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.api.services.IProductVersionService;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.jpa.ColorJpa;
import com.moe.socialnetwork.jpa.ProductJpa;
import com.moe.socialnetwork.jpa.ProductVersionJpa;
import com.moe.socialnetwork.jpa.SizeJpa;
import com.moe.socialnetwork.models.Color;
import com.moe.socialnetwork.models.Product;
import com.moe.socialnetwork.models.ProductVersion;
import com.moe.socialnetwork.models.Size;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class ProductVersionServiceImpl implements IProductVersionService {

    private final ProductVersionJpa productVersionJpa;
    private final ColorJpa colorJpa;
    private final SizeJpa sizeJpa;
    private final ProductJpa productJpa;

    public ProductVersionServiceImpl(ProductVersionJpa productVersionJpa, ColorJpa colorJpa, SizeJpa sizeJpa,
            ProductJpa productJpa) {
        this.productVersionJpa = productVersionJpa;
        this.colorJpa = colorJpa;
        this.sizeJpa = sizeJpa;
        this.productJpa = productJpa;

    }

    public List<ColorAllDto> getColorAll() {
        List<Color> color = colorJpa.findAll();
        return color.stream().map(this::mapToDTO).collect(Collectors.toList());

    }

    public List<SizeAllDto> getSizeAll() {
        List<Size> size = sizeJpa.findAll();
        return size.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public PageDto<ProductVersionAllDto> getProductVersionAll(String productCode, String query, int page, int size,
            String sort) {

        UUID productCodeUUID = UUID.fromString(productCode);

        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<ProductVersion> productVersions = productVersionJpa.searchByName(query, productCodeUUID, pageable);

        List<ProductVersionAllDto> contents = productVersions.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(productVersions, contents);

    }

    public ProductVersionAllDto createProductVersion(User user, ProductVersionCreateDto productVersionCreateDto) {
        try {
            UUID colorCode = UUID.fromString(productVersionCreateDto.getColorCode());
            UUID sizeCode = UUID.fromString(productVersionCreateDto.getSizeCode());
            UUID productCode = UUID.fromString(productVersionCreateDto.getProductCode());
            Color color = colorJpa.findByCode(colorCode)
                    .orElseThrow(() -> new AppException("Color not found", 404));
            Size size = sizeJpa.findByCode(sizeCode)
                    .orElseThrow(() -> new AppException("Size not found", 404));

            Product product = productJpa.findByCode(productCode)
                    .orElseThrow(() -> new AppException("Product not found", 404));

            boolean exists = productVersionJpa.existsByColorIdAndSizeId(product.getId(), color.getId(), size.getId());
            if (exists) {
                throw new AppException("Product version with the same color and size already exists.",
                        409);
            }

            ProductVersion productVersion = new ProductVersion();
            productVersion.setName(productVersionCreateDto.getName());

            productVersion.setQuantity(productVersionCreateDto.getQuantity());
            productVersion.setImage(productVersionCreateDto.getImage());
            productVersion.setColor(color);
            productVersion.setSize(size);
            productVersion.setProduct(product);

            productVersion.setUserCreate(user);
            productVersion.setUserUpdate(user);
            productVersionJpa.save(productVersion);
            ProductVersionAllDto productAllDto = mapToDTO(productVersion);
            return productAllDto;
        } catch (Exception e) {
            throw new AppException("An error occurred while creating product: " + e.getMessage(), 500);
        }
    };

    public ProductVersionAllDto updateProductVersion(User user, ProductVersionUpdateDto productVersionUpdateDto) {
        try {
            UUID productVersionCode = UUID.fromString(productVersionUpdateDto.getCode());
            UUID colorCode = UUID.fromString(productVersionUpdateDto.getColorCode());
            UUID sizeCode = UUID.fromString(productVersionUpdateDto.getSizeCode());
            UUID productCode = UUID.fromString(productVersionUpdateDto.getProductCode());

            ProductVersion productVersion = productVersionJpa.findByCode(productVersionCode)
                    .orElseThrow(() -> new AppException("Product version not found", 404));
            Color color = colorJpa.findByCode(colorCode)
                    .orElseThrow(() -> new AppException("Color not found", 404));
            Size size = sizeJpa.findByCode(sizeCode)
                    .orElseThrow(() -> new AppException("Size not found", 404));

            Product product = productJpa.findByCode(productCode)
                    .orElseThrow(() -> new AppException("Product not found", 404));
            boolean exists = productVersionJpa.existsByColorIdAndSizeId(product.getId(), color.getId(), size.getId());
            if (exists) {
                throw new AppException("Product version with the same color and size already exists.",
                        409);
            }
            productVersion.setName(productVersionUpdateDto.getName());

            productVersion.setQuantity(productVersionUpdateDto.getQuantity());
            productVersion.setImage(productVersionUpdateDto.getImage());
            productVersion.setColor(color);
            productVersion.setSize(size);
            productVersion.setProduct(product);

            productVersion.setUserCreate(user);
            productVersion.setUserUpdate(user);
            productVersionJpa.save(productVersion);
            ProductVersionAllDto productAllDto = mapToDTO(productVersion);
            return productAllDto;
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid product code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while updating product: " + e.getMessage(), 500);
        }
    };

    public void deleteProductVersion(User user, CodeDto codeDto) {
        try {
            UUID productVersionCode = UUID.fromString(codeDto.getCode());
            ProductVersion productVersion = productVersionJpa.findByCode(productVersionCode)
                    .orElseThrow(() -> new AppException("Product version not found", HttpStatus.NOT_FOUND.value()));

            productVersion.softDelete();
            productVersion.setUserDelete(user);
            productVersionJpa.save(productVersion);

        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid product code format", HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            throw new AppException("An error occurred while delete product: " + e.getMessage(), 500);
        }
    }

    private ProductVersionAllDto mapToDTO(ProductVersion product) {

        return new ProductVersionAllDto(product.getCode().toString(),
                product.getName(),

                product.getQuantity(),
                product.getImage(),
                product.getSize().getCode().toString(),
                product.getColor().getCode().toString(),
                product.getProduct().getCode().toString(),

                product.getCreatedAt().toString(),
                product.getUserCreate().getCode().toString(),
                product.getUserCreate().getDisplayName(),
                product.getUpdatedAt().toString(),
                product.getUserUpdate().getCode().toString(),
                product.getUserUpdate().getDisplayName());
    }

    private ColorAllDto mapToDTO(Color color) {
        return new ColorAllDto(color.getCode().toString(),
                color.getName(),
                color.getCreatedAt().toString(),
                color.getUserCreate().getCode().toString(),
                color.getUserCreate().getDisplayName(),
                color.getUpdatedAt().toString(),
                color.getUserUpdate().getCode().toString(),
                color.getUserUpdate().getDisplayName());
    }

    private SizeAllDto mapToDTO(Size size) {
        return new SizeAllDto(size.getCode().toString(),
                size.getName(),
                size.getCreatedAt().toString(),
                size.getUserCreate().getCode().toString(),
                size.getUserCreate().getDisplayName(),
                size.getUpdatedAt().toString(),
                size.getUserUpdate().getCode().toString(),
                size.getUserUpdate().getDisplayName());
    }
}
