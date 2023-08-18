/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.PriceGroupDto;
import com.titan.poss.product.dto.request.PriceGroupUpdateDto;
import com.titan.poss.product.dto.response.PriceGroupLiteDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface PriceGroupService {

	/**
	 * This method will return the list of PriceGroup details based on the isActive.
	 * 
	 * @param isActive
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<PriceGroupDto>>
	 */
	PagedRestResponse<List<PriceGroupDto>> listPriceGroup(Boolean isActive, Boolean isPageable, Pageable pageable);





	/**
	 * This method will return the PriceGroup details based on the priceGroup.
	 * 
	 * @param priceGroup
	 * @return PriceGroupDto
	 */
	PriceGroupDto getPriceGroup(String priceGroup);





	/**
	 * This method will save the PriceGroup details.
	 * 
	 * @param priceGroupDto
	 * @return PriceGroupDto
	 */
	PriceGroupDto addPriceGroup(PriceGroupDto priceGroupDto);





	/**
	 * This method will update the PriceGroup details.
	 * 
	 * @param priceGroup
	 * @param priceGroupUpdateDto
	 * @return PriceGroupDto
	 */
	PriceGroupDto updatePriceGroup(String priceGroup, PriceGroupUpdateDto priceGroupUpdateDto);

	/**
	 * @param isPageable
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<PriceGroupLiteDto>> listPriceGroupLite(Boolean isPageable, Pageable pageable);
}
