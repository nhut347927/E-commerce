package com.moe.socialnetwork.api.services;

import java.util.List;

import com.moe.socialnetwork.api.dtos.ColorAllDto;
import com.moe.socialnetwork.api.dtos.ProductVersionAllDto;
import com.moe.socialnetwork.api.dtos.ProductVersionCreateDto;
import com.moe.socialnetwork.api.dtos.ProductVersionUpdateDto;
import com.moe.socialnetwork.api.dtos.SizeAllDto;
import com.moe.socialnetwork.api.dtos.common.CodeDto;
import com.moe.socialnetwork.api.dtos.common.PageDto;
import com.moe.socialnetwork.models.User;

public interface IProductVersionService {
    List<ColorAllDto> getColorAll();

    List<SizeAllDto> getSizeAll();

    PageDto<ProductVersionAllDto> getProductVersionAll(String productCode, String query, int page, int size, String sort);

    ProductVersionAllDto createProductVersion(User user, ProductVersionCreateDto productCreateDto);

    ProductVersionAllDto updateProductVersion(User user, ProductVersionUpdateDto productUpdateDto);

    void deleteProductVersion(User user, CodeDto codeDto);
}
