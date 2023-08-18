/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.ProductGroupDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dto.request.ProductGroupUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface ProductGroupService {

	/**
	 * This method will return the list of ProductGroup details based on the
	 * isActive.
	 * 
	 * @param isActive
	 * @param productGroupCode
	 * @param pricingType
	 * @param isConversionAllowed
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<ProductGroupDto>>
	 */
	PagedRestResponse<List<ProductGroupDto>> listProductGroup(Boolean isActive, String productGroupCode,
			String pricingType, Boolean isConversionAllowed, Boolean isPageable, Pageable pageable);

	/**
	 * This method will return the ProductGroup details based on the
	 * productGroupCode.
	 * 
	 * @param productGroupCode
	 * @return ProductGroupDto
	 */
	ProductGroupDto getProductGroup(String productGroupCode);

	/**
	 * This method will save the ProductGroup details.
	 * 
	 * @param productGroupDto
	 * @return ProductGroupDto
	 */
	ProductGroupDto addProductGroup(ProductGroupDto productGroupDto);

	/**
	 * This method will update the ProductGroup details.
	 * 
	 * @param productGroupCode
	 * @param productGroupUpdateDto
	 * @return ProductGroupDto
	 */
	ProductGroupDto updateProductGroup(String productGroupCode, ProductGroupUpdateDto productGroupUpdateDto);

	/**
	 * @param productGroupCode
	 * @return ProductGroupDao
	 */
	ProductGroupDao getProductGroupDao(String productGroupCode);
}
