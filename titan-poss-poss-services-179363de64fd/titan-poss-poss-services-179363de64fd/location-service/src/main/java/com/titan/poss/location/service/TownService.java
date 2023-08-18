/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.request.TownCreateDto;
import com.titan.poss.location.dto.request.TownUpdateDto;
import com.titan.poss.location.dto.response.TownDto;
import com.titan.poss.location.dto.response.TownLiteDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface TownService {

	/**
	 * This method will return the list of Town details based on the isActive.
	 * @param townName 
	 * 
	 * @param stateId
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<TownDto>>
	 */
	PagedRestResponse<List<TownDto>> listTown(String stateId, String townName, Boolean isActive, Pageable pageable);

	/**
	 * This method will return the list of Town details based on the stateId and
	 * isPageable.
	 * 
	 * @param stateId
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<TownLiteDto>>
	 */
	PagedRestResponse<List<TownLiteDto>> listTownLite(String stateId, Boolean isPageable, Pageable pageable);

	/**
	 * This method will return the Town details based on the townCode.
	 * 
	 * @param townCode
	 * @return TownDto
	 */
	TownDto getTown(String townCode);

	/**
	 * This method will save the Town details.
	 * 
	 * @param townDto
	 * @return TownDto
	 */
	TownDto addTown(TownCreateDto townDto);

	/**
	 * This method will update the Town details.
	 * 
	 * @param townCode
	 * @param townDto
	 * @return TownDto
	 */
	TownDto updateTown(String townCode, @Valid TownUpdateDto townUpdateDto);

	/**
	 * This method will return the list of Town details based on the town name
	 * 
	 * @param townName
	 * @return List<TownLiteDto>
	 */
	PagedRestResponse<List<TownLiteDto>> getTownLite(String townName, Boolean isPageable, Pageable pageable);

}
