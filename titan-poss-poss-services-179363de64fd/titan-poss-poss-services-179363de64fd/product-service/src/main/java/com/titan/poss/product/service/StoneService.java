/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.dto.StoneDto;
import com.titan.poss.product.dto.request.StoneUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface StoneService {

	/**
	 * This method will return the list of Stone details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StoneDto>>
	 */
	PagedRestResponse<List<StoneDto>> listStone(Boolean isActive, Pageable pageable);





	/**
	 * This method will return the Stone details based on the stoneCode.
	 * 
	 * @param stoneCode
	 * @return StoneDto
	 */
	StoneDto getStone(String stoneCode);





	/**
	 * This method will save the Stone details.
	 * 
	 * @param stoneDto
	 * @return StoneDto
	 */
	StoneDto addStone(StoneDto stoneDto);





	/**
	 * This method will update the Stone details.
	 * 
	 * @param stoneCode
	 * @param stoneUpdateDto
	 * @return StoneDto
	 */
	StoneDto updateStone(String stoneCode, StoneUpdateDto stoneUpdateDto);

	/**
	 * @param stoneCode
	 * @return StoneDao
	 */
	StoneDao getStoneDao(String stoneCode);
}
