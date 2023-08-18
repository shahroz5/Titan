/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.request.TaxConfigsCreateDto;
import com.titan.poss.location.dto.request.TaxConfigsUpdateDto;
import com.titan.poss.location.dto.response.TaxConfigsDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface TaxConfigsService {

	/**
	 * 
	 * @param isActive
	 * @param srcLocationTaxType
	 * @param destLocationTaxType
	 * @param customerTaxType
	 * @param taxType
	 * @param pageable
	 * @return PagedRestResponse<List<TaxConfigsDto>>
	 */
	PagedRestResponse<List<TaxConfigsDto>> listTaxConfigs(Boolean isActive, String srcLocationTaxType,
			String destLocationTaxType, String customerTaxType, String taxType, Pageable pageable);

	/**
	 * 
	 * @param id
	 * @return TaxConfigsDto
	 */
	TaxConfigsDto getTaxConfigs(String id);

	/**
	 * 
	 * @param taxConfigsCreateDto
	 * @return TaxConfigsDto
	 */
	TaxConfigsDto addTaxConfigs(TaxConfigsCreateDto taxConfigsCreateDto);

	/**
	 * 
	 * @param id
	 * @param taxConfigsUpdateDto
	 * @return TaxConfigsDto
	 */
	TaxConfigsDto updateTaxConfigs(String id, TaxConfigsUpdateDto taxConfigsUpdateDto);
}