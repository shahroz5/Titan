/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.ProductCategoryDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dto.request.ProductCategoryUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface ProductCategoryService {

	/**
	 * This method will return the list of ProductCategory details based on the
	 * isActive.
	 * 
	 * @param isActive
	 * @param isConversionAllowed
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<ProductCategoryDto>>
	 */
	PagedRestResponse<List<ProductCategoryDto>> listProductCategory(Boolean isActive, Boolean isConversionAllowed,
			Boolean isPageable, Pageable pageable);

	/**
	 * This method will return the ProductCategory details based on the
	 * productCategoryCode.
	 * 
	 * @param productCategoryCode
	 * @return ProductCategoryDto
	 */
	ProductCategoryDto getProductCategory(String productCategoryCode);

	/**
	 * This method will save the ProductCategory details.
	 * 
	 * @param productCategoryDto
	 * @return ProductCategoryDto
	 */
	ProductCategoryDto addProductCategory(ProductCategoryDto productCategoryDto);

	/**
	 * This method will update the ProductCategory details.
	 * 
	 * @param productCategoryCode
	 * @param productCategoryUpdateDto
	 * @return ProductCategoryDto
	 */
	ProductCategoryDto updateProductCategory(String productCategoryCode,
			ProductCategoryUpdateDto productCategoryUpdateDto);

	/**
	 * @param productCategoryCode
	 * @return ProductCategoryDao
	 */
	ProductCategoryDao getProductCategoryDao(@PatternCheck(regexp = "^[A-Za-z0-9 ]{1,20}$") String productCategoryCode);
}
