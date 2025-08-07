package com.moe.socialnetwork.api.services;

import java.util.List;

import com.moe.socialnetwork.api.dtos.BrandAllDto;
import com.moe.socialnetwork.api.dtos.CategoryAllDto;
import com.moe.socialnetwork.api.dtos.ProductAllBasicDto;
import com.moe.socialnetwork.api.dtos.ProductAllDto;
import com.moe.socialnetwork.api.dtos.ProductCreateDto;
import com.moe.socialnetwork.api.dtos.ProductUpdateDto;
import com.moe.socialnetwork.api.dtos.TagAllDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

public interface IProductService {
    PageDto<ProductAllBasicDto> getProductAllBasic(String query, int page, int size, String sort);

    List<BrandAllDto> getBrandAll();

    List<CategoryAllDto> getCategoryAll();

    List<TagAllDto> getTagAll();

    ProductAllDto getProduct(CodeDto codeDto);

    PageDto<ProductAllDto> getProductAll(String query, int page, int size, String sort);

    ProductAllDto createProduct(User user, ProductCreateDto productCreateDto);

    ProductAllDto updateProduct(User user, ProductUpdateDto productUpdateDto);

    void deleteProduct(User user, CodeDto codeDto);
}
