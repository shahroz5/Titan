/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.PurityDto;
import com.titan.poss.product.dto.request.PurityCreateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface PurityService {

	/**
	 * This method will return the list of Purity details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PurityDto>>
	 */
	PagedRestResponse<List<PurityDto>> listPurity(Boolean isActive, BigDecimal purity, String itemTypeCode,
			Pageable pageable);

	/**
	 * This method will save the Purity details.
	 * 
	 * @param purityCreateDto
	 * @return PurityDto
	 */
	PurityDto addPurity(PurityCreateDto purityCreateDto);

	/**
	 * This method will update the Purity details.
	 * 
	 * @param id
	 * @param purityCreateDto
	 * @return PurityDto
	 */
	PurityDto updatePurity(PurityCreateDto purityCreateDto);
}
