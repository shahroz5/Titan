/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dao.StoneTypeDao;
import com.titan.poss.product.dto.StoneTypeDto;
import com.titan.poss.product.dto.request.StoneTypeUpdateDto;
import com.titan.poss.product.dto.response.StoneTypeLiteDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface StoneTypeService {

	/**
	 * This method will return the list of StoneType details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StoneTypeDto>>
	 */
	PagedRestResponse<List<StoneTypeDto>> listStoneType(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the list of StoneType details based on the
	 * isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @param stoneTypeCode
	 * @return PagedRestResponse<List<StoneTypeLiteDto>>
	 */
	PagedRestResponse<List<StoneTypeLiteDto>> listStoneTypeLite(Boolean isPageable, String stoneTypeCode,
			Pageable pageable);

	/**
	 * This method will return the StoneType details based on the stoneTypeCode.
	 * 
	 * @param stoneTypeCode
	 * @return StoneTypeDto
	 */
	StoneTypeDto getStoneType(String stoneTypeCode);

	/**
	 * This method will save the StoneType details.
	 * 
	 * @param stoneTypeDto
	 * @return StoneTypeDto
	 */
	StoneTypeDto addStoneType(StoneTypeDto stoneTypeDto);

	/**
	 * This method will update the StoneType details.
	 * 
	 * @param stoneTypeCode
	 * @param stoneTypeUpdateDto
	 * @return StoneTypeDto
	 */
	StoneTypeDto updateStoneType(String stoneTypeCode, StoneTypeUpdateDto stoneTypeUpdateDto);

	/**
	 * @param stoneTypeCode
	 * @return StoneTypeDao
	 */
	StoneTypeDao getStoneTypeDao(String stoneTypeCode);

	/**
	 * 
	 * @param pageable
	 * @return PagedRestResponse<List<String>>
	 */
	PagedRestResponse<List<String>> listStoneQualityLite(Pageable pageable);
}
