/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.inventory.dao.BinDaoExt;
import com.titan.poss.inventory.dto.request.BinCreateDto;
import com.titan.poss.inventory.dto.request.BinUpdateDto;
import com.titan.poss.inventory.dto.response.BinDetailsDto;
import com.titan.poss.inventory.dto.response.BinDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface BinService {

	/**
	 * This method will return the list of Bins based on binRequestType and
	 * userType.
	 * 
	 * @param binRequestType
	 * @param userType
	 * @return ListResponse<BinDetailsDto>
	 */
	ListResponse<BinDetailsDto> listBin(String binRequestType, UserTypeEnum userType);

	/**
	 * This method will return the Bin details based on the binCode and isActive.
	 * 
	 * @param binCode
	 * @param binGroupCode
	 * @param isActive
	 * @return BinDto
	 */
	BinDto getBin(String binCode, String binGroupCode, Boolean isActive);

	/**
	 * This method will save the Bin details.
	 * 
	 * @param binCreateDto
	 * @return BinDto
	 */
	BinDto addBin(BinCreateDto binCreateDto);

	/**
	 * This method will update the Bin details based on the binCode.
	 * 
	 * @param binCode
	 * @param binUpdateDto
	 * @return BinUpdateDto
	 */
	BinUpdateDto updateBin(String binCode, BinUpdateDto binUpdateDto);

	/**
	 * @param binCode
	 * @param binGroup
	 * @return BinDaoExt
	 */
	BinDaoExt getBinDao(String binCode, String binGroup);

	/**
	 * This method will return the list of BinCodes based on binRequestType and
	 * userType.
	 * 
	 * @param binRequestType
	 * @param userType
	 * @return ListResponse<BinDetailsDto>
	 */
	List<String> getBinGroupList(String binRequestType, UserTypeEnum userType);

}
