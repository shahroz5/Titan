/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.request.BrandUpdateDto;
import com.titan.poss.location.dto.response.BrandLiteDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface BrandService {

	/**
	 * This method will return the list of Brand/Sub Brand details based on the
	 * isActive and parentBrandCode.
	 * 
	 * @param isActive
	 * @param parentBrandCode
	 * @param pageable
	 * @return PagedRestResponse<List<BrandDto>>
	 */
	PagedRestResponse<List<BrandDto>> listBrand(Boolean isActive, String parentBrandCode, Pageable pageable);

	/**
	 * This method will return the list of Brand/Sub Brand details based on the
	 * parentBrandCode and isPageable.
	 * 
	 * @param parentBrandCode
	 * @param isPageable
	 * @param pageable
	 * @param parentBrandCodes
	 * @return PagedRestResponse<List<BrandLiteDto>>
	 */
	PagedRestResponse<List<BrandLiteDto>> listBrandLite(String parentBrandCode, Boolean isPageable, Pageable pageable,
			List<String> parentBrandCodes);

	/**
	 * This method will return the Brand details based on the parentBrandCode and
	 * brandCode.
	 * 
	 * @param parentBrandCode
	 * @param brandCode
	 * @return BrandDto
	 */
	BrandDto getBrand(String parentBrandCode, String brandCode);

	/**
	 * This method will save the Brand details.
	 * 
	 * @param brandDto
	 * @return BrandDto
	 */
	BrandDto addBrand(BrandDto brandDto);

	/**
	 * This method will update the Brand details.
	 * 
	 * @param brandCode
	 * @param brandUpdateDto
	 * @return BrandDto
	 */
	BrandDto updateBrand(String brandCode, BrandUpdateDto brandUpdateDto);

}
