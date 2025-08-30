package com.moe.ecommerce.api.services;

import java.util.List;

import com.moe.ecommerce.api.dtos.ColorAllDto;
import com.moe.ecommerce.api.dtos.ProductVersionAllDto;
import com.moe.ecommerce.api.dtos.ProductVersionBaseDto;
import com.moe.ecommerce.api.dtos.ProductVersionCreateDto;
import com.moe.ecommerce.api.dtos.ProductVersionUpdateDto;
import com.moe.ecommerce.api.dtos.SizeAllDto;
import com.moe.ecommerce.api.dtos.common.CodeDto;
import com.moe.ecommerce.api.dtos.common.PageDto;
import com.moe.ecommerce.models.User;

public interface IProductVersionService {
    List<ProductVersionBaseDto> getAllProductVersionByProductCode(CodeDto codeDto);

    List<ColorAllDto> getColorAll();

    List<SizeAllDto> getSizeAll();

    PageDto<ProductVersionAllDto> getProductVersionAll(String productCode, String query, int page, int size,
            String sort);

    ProductVersionAllDto createProductVersion(User user, ProductVersionCreateDto productCreateDto);

    ProductVersionAllDto updateProductVersion(User user, ProductVersionUpdateDto productUpdateDto);

    void deleteProductVersion(User user, CodeDto codeDto);

}
