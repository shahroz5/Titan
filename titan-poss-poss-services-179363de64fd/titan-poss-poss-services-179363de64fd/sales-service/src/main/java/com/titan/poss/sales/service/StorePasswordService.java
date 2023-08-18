/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.request.StorePasswordRequestDto;
import com.titan.poss.sales.dto.response.StorePasswordResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface StorePasswordService {

	/**
	 * 
	 * @param storePasswordDto
	 * @return StorePasswordResponseDto
	 */
	StorePasswordResponseDto generateStorePassword(StorePasswordRequestDto storePasswordDto);

	/**
	 * 
	 * @param contextType
	 * @param businessDate
	 * @param isPageable
	 * @param pageable
	 * @return StorePasswordResponseDto
	 */
	PagedRestResponse<List<StorePasswordResponseDto>> listStorePassword(String contextType, Date businessDate,
			Pageable pageable, Boolean isPageable);

}
