/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.store.dto.request.CustomerTownAddDto;
import com.titan.poss.store.dto.request.CustomerTownUpdateDto;
import com.titan.poss.store.dto.response.CustomerTownDto;

/**
 * Service interface for CustomerTown.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("StoreCustomerTownService")
public interface CustomerTownService {

	/**
	 * This method will return the list of Town details based on the isActive.
	 * 
	 * @param stateName
	 * @param description
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<TownDto>>
	 */
	PagedRestResponse<List<CustomerTownDto>> listTown(String stateName, String description, Boolean isActive,
			Pageable pageable);

	/**
	 * This method will save the Town details.
	 * 
	 * @param townDto
	 * @return void
	 */
	CustomerTownDto addTown(CustomerTownAddDto townDto);

	/**
	 * This method will return the Town details based on the townCode.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	CustomerTownDto getTown(Integer townCode);

	/**
	 * This method will update the Town details.
	 * 
	 * @param townCode
	 * @param townDto
	 * @return void
	 */
	CustomerTownDto updateTown(Integer townCode, CustomerTownUpdateDto townUpdateDto);

}
