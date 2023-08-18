/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.PriceDto;
import com.titan.poss.product.dto.response.ProductPriceDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface PriceService {

	/**
	 * This method will return the list of Price details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PriceDto>>
	 */
	PagedRestResponse<List<PriceDto>> listPrice(Boolean isActive, String itemCode, String priceGroup,
			Pageable pageable);


	/**
	 * This method will save the Price details.
	 * 
	 * @param priceDto
	 * @return PriceDto
	 */
	PriceDto addPrice(PriceDto priceDto);

	/**
	 * This method will update the Price details.
	 * 
	 * @param priceDto
	 * @return PriceDto
	 */
	PriceDto updatePrice(PriceDto priceDto);

	/**
	 * @param productGroupCode
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<ProductPriceDto>> listProductPrice(String productGroupCode, Pageable pageable);

}
