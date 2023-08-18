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
import com.titan.poss.location.dto.request.StateCreateDto;
import com.titan.poss.location.dto.request.StateUpdateDto;
import com.titan.poss.location.dto.response.StateDto;
import com.titan.poss.location.dto.response.StateLiteDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface StateService {

	/**
	 * This method will return the list of State details based on the isActive.
	 * 
	 * @param countryCode
	 * @param isActive
	 * @param isPageable 
	 * @param pageable
	 * @return PagedRestResponse<List<StateDto>>
	 */
	PagedRestResponse<List<StateDto>> listState(String countryCode, String stateName, Boolean isActive,
			Boolean isPageable, Pageable pageable);

	/**
	 * This method will return the State details based on the stateCode.
	 * 
	 * @param stateCode
	 * @return StateDto
	 */
	StateDto getState(String stateId);

	/**
	 * This method will save the State details.
	 * 
	 * @param stateCreateDto
	 * @return StateDto
	 */
	StateDto addState(StateCreateDto stateCreateDto);

	/**
	 * This method will update the State details.
	 * 
	 * @param stateCode
	 * @param stateDto
	 * @return StateUpdateDto
	 */
	StateDto updateState(String stateId, @Valid StateUpdateDto stateUpdateDto);

	/**
	 * @param regionCodes
	 * @param countryCodes
	 * @param isPageable
	 * @param pageable
	 * @return @return <List<StateLiteDto>>
	 */
	PagedRestResponse<List<StateLiteDto>> listStateLite(List<String> regionCodes, List<String> countryCodes,
			Boolean isPageable, Pageable pageable);

}
