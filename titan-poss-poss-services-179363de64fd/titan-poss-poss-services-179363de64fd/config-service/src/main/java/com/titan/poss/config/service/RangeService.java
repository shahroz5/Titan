/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.config.dao.RangeMasterDaoExt;
import com.titan.poss.config.dto.request.RangeRequestDto;
import com.titan.poss.config.dto.response.RangeResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface RangeService {

	PagedRestResponse<List<RangeResponseDto>> listRange(String id, String rangeType, Boolean isPageable,
			Boolean isActive, Pageable pageable);

	ListResponse<RangeResponseDto> updateRange(String rangeType, RangeRequestDto rangeRequestDto);

	RangeResponseDto getRange(String id, String rangeType);

	RangeMasterDaoExt getRangeMasterDao(String id);
	
	RangeMasterDaoExt getActiveRangeId(String id);

}
