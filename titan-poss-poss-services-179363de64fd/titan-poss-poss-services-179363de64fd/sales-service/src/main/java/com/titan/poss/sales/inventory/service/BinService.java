/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.inventory.dto.response.BinDetailsDto;

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
	 * This method will return the list of BinCodes based on binRequestType and
	 * userType.
	 * 
	 * @param binRequestType
	 * @param userType
	 * @return ListResponse<BinDetailsDto>
	 */
	List<String> getBinGroupList(String binRequestType, UserTypeEnum userType);

}
