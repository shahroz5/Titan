/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.request.PIFSeriesUpdateRequestDto;
import com.titan.poss.sales.dto.response.PIFSeriesDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("pifSeriesService")
public interface PIFSeriesService {

	/**
	 * This Method will return the list of of PIF series
	 * 
	 * @param pageable
	 * @return PagedRestResponse<List<PIFSeriesDto>>
	 */
	PagedRestResponse<List<PIFSeriesDto>> listPifSeries(Boolean isActive, Pageable pageable);

	/**
	 * This method will update the PIF series fromNo and toNo
	 * 
	 * @param pIFSeriesRequestDto
	 * @return List<PIFSeriesDto>
	 */
	ListResponse<PIFSeriesDto> updatePifSeries(PIFSeriesUpdateRequestDto pIFSeriesRequestDto);

}
