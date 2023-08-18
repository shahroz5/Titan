/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dao.BinGroupDao;
import com.titan.poss.inventory.dto.request.BinGroupUpdateDto;
import com.titan.poss.inventory.dto.response.BinCodeDto;
import com.titan.poss.inventory.dto.response.BinCodeLiteDto;
import com.titan.poss.inventory.dto.response.BinGroupDto;
import com.titan.poss.inventory.dto.response.BinLocationDto;
import com.titan.poss.inventory.dto.response.LocationCodeDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface BinGroupService {

	/**
	 * This method will return the list of BinGroup details based on isActive,
	 * locationCode and isPageable.
	 * 
	 * @param isActive
	 * @param locationCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BinGroupDto>>
	 */
	PagedRestResponse<List<BinGroupDto>> listBinGroup(Boolean isActive, String locationCode, Boolean isPageable,
			Pageable pageable);

	/**
	 * This method will return the BinGroup details based on the binGroupCode.
	 * 
	 * @param binGroupCode
	 * @return BinGroupDto
	 */
	BinGroupDto getBinGroup(String binGroupCode);

	/**
	 * This method will save the BinGroup details.
	 * 
	 * @param binGroupDto
	 * @return BinGroupDto
	 */
	BinGroupDto addBinGroup(BinGroupDto binGroupDto);

	/**
	 * This method will update the BinGroup details based on the binGroupCode.
	 * 
	 * @param binGroupCode
	 * @param binGroupUpdateDto
	 * @return BinGroupDto
	 */
	BinGroupDto updateBinGroup(String binGroupCode, BinGroupUpdateDto binGroupUpdateDto);

	/**
	 * This method will return the list of Bin details based on the binGroupCode,
	 * locationCode , isActive and isPageable.
	 * 
	 * @param binGroupCode
	 * @param locationCode
	 * @param isActive
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BinCodeDto>>
	 */
	PagedRestResponse<List<BinCodeDto>> listBin(String binGroupCode, String locationCode, Boolean isActive,
			Boolean isPageable, Pageable pageable);

	/**
	 * This method will return the list of location codes based on binGroupCode,
	 * binCodes and isActive.
	 * 
	 * @param binGroupCode
	 * @param binCodes
	 * @param isActive
	 * @return ListResponse<LocationCodeDto>
	 */
	ListResponse<LocationCodeDto> getLocationCodes(String binGroupCode, List<String> binCodes, Boolean isActive);

	/**
	 * This method will create/remove mapping between BinGroup details and
	 * locations.
	 * 
	 * @param binGroupCode
	 * @param binLocationDto
	 * @return BinLocationDto
	 */
	BinLocationDto locationsMapping(String binGroupCode, BinLocationDto binLocationDto);

	/**
	 * This method will return the list of Bin details based on the binGroupCode,
	 * locationCode , isActive and isPageable.
	 * 
	 * @param binGroupCode
	 * @param locationCode
	 * @param isActive
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BinCodeDto>>
	 */
	PagedRestResponse<List<BinCodeLiteDto>> listBinLite(String binGroupCode, Boolean isPageable, Pageable pageable);

	/**
	 * @param binGroupCode
	 * @return BinGroupDao
	 */
	BinGroupDao getBinGroupDao(String binGroupCode);

}
