/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.RegionLiteDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.RegionDto;
import com.titan.poss.location.dto.request.RegionUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface RegionService {

	/**
	 * This method will return the list of Region details based on the isActive.
	 * 
	 * @param isActive
	 * @param parentRegionCode
	 * @param pageable
	 * @return PagedRestResponse<List<RegionDto>>
	 */
	PagedRestResponse<List<RegionDto>> listRegion(Boolean isActive, String parentRegionCode, Pageable pageable);

	/**
	 * This method will return the list of Region/Sub Region details based on the
	 * parentRegionCode and isPageable.
	 * 
	 * @param parentRegionCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<RegionLiteDto>>
	 */
	PagedRestResponse<List<RegionLiteDto>> listRegionLite(String regionCode, String parentRegionCode,
			Boolean isPageable, Pageable pageable);

	/**
	 * This method will return the Region details based on the parentRegionCode and
	 * regionCode.
	 * 
	 * @param parentRegionCode
	 * @param regionCode
	 * @return RegionDto
	 */
	RegionDto getRegion(String parentRegionCode, String regionCode);

	/**
	 * This method will save the Region details.
	 * 
	 * @param regionDto
	 * @return RegionDto
	 */
	RegionDto addRegion(RegionDto regionDto);

	/**
	 * This method will update the Region details.
	 * 
	 * @param regionCode
	 * @param regionDto
	 * @return RegionDto
	 */
	RegionDto updateRegion(String regionCode, RegionUpdateDto regionUpdateDto);
}
