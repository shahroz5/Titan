/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.StateTaxDetailsDto;
import com.titan.poss.location.dto.request.StateTaxMappingCreateDto;
import com.titan.poss.location.dto.request.StateTaxMappingUpdateDto;
import com.titan.poss.location.dto.response.StateTaxMappingDto;
import com.titan.poss.location.dto.response.TaxDetailsDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface StateTaxService {

	/**
	 * This method will return the list of StateTax details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StateTaxMappingDto>>
	 */
	PagedRestResponse<List<StateTaxMappingDto>> listStateTax(Boolean isActive, String stateId, Pageable pageable);

	/**
	 * This method will return the StateTax details based on the id.
	 * 
	 * @param id
	 * @return StateTaxMappingDto
	 */
	StateTaxMappingDto getStateTax(String id);

	/**
	 * This method will save the StateTax details.
	 * 
	 * @param stateTaxCreateDto
	 * @return StateTaxMappingDto
	 */
	StateTaxMappingDto addStateTax(StateTaxMappingCreateDto stateTaxMappingCreateDto);

	/**
	 * This method will update the StateTax details.
	 * 
	 * @param id
	 * @param stateTaxUpdateDto
	 * @return StateTaxUpdateDto
	 */
	StateTaxMappingDto updateStateTax(String id, @Valid StateTaxMappingUpdateDto stateTaxMappingUpdateDto);

	/**
	 * @param stateTaxMappingId
	 * @return StateTaxDetailsDto
	 */
	ListResponse<TaxDetailsDto> getTaxDetails(String stateTaxMappingId);

	/**
	 * @param stateTaxMappingId
	 * @param stateTaxDetailsDto
	 * @return StateTaxDetailsDto
	 */
	StateTaxDetailsDto updateStateTaxDetails(String stateTaxMappingId, StateTaxDetailsDto stateTaxDetailsDto);
}
