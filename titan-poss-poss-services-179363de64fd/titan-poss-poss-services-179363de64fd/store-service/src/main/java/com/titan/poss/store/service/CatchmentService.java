/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.store.dto.request.CatchmentAddDto;
import com.titan.poss.store.dto.request.CatchmentUpdateDto;
import com.titan.poss.store.dto.response.CatchmentDto;

/**
 * Service interface for Catchment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("StoreCatchMentService")
public interface CatchmentService {

	/**
	 * This method will return the list of Catchment details.
	 * 
	 * @param stateCode
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<TownDto>>
	 */
	PagedRestResponse<List<CatchmentDto>> listCatchmentArea(String searchField, Boolean isActive, Pageable pageable);

	/**
	 * This method will update the Catchment details.
	 * 
	 * @param catchmentCode
	 * @param catchmentUpdateDto
	 * @return void
	 */
	CatchmentDto updateCatchment(String catchmentCode, @Valid CatchmentUpdateDto catchmentUpdateDto);

	/**
	 * This method will save the Catchment details.
	 * 
	 * @param catchmentAddDto
	 * @return void
	 */
	CatchmentDto addCatchment(@Valid CatchmentAddDto catchmentAddDto);

	/**
	 * This method will return the Catchment details based on the catchmentCode.
	 * 
	 * @param catchmentCode
	 * @return CatchmentDto
	 */
	CatchmentDto getCatchment(String catchmentCode);

	/**
	 * This method will check and save the Catchment details.
	 * 
	 * @param catchmentAddDto
	 * @return void
	 */
	boolean saveCatchment(String description);

}
