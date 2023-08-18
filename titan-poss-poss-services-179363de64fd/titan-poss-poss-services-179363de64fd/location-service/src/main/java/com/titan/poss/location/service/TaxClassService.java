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
import com.titan.poss.location.dto.TaxClassDto;
import com.titan.poss.location.dto.request.TaxClassUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface TaxClassService {

	/**
	 * This method will return the list of TaxClass details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @param isPageable
	 * @return PagedRestResponse<List<TaxClassDto>>
	 */
	PagedRestResponse<List<TaxClassDto>> listTaxClass(Boolean isActive, Pageable pageable, Boolean isPageable);





	/**
	 * This method will return the TaxClass details based on the taxClassCode.
	 * 
	 * @param taxClassCode
	 * @return TaxClassDto
	 */
	TaxClassDto getTaxClass(String taxClassCode);





	/**
	 * This method will save the TaxClass details.
	 * 
	 * @param taxClassDto
	 * @return TaxClassDto
	 */
	TaxClassDto addTaxClass(TaxClassDto taxClassDto);





	/**
	 * This method will update the TaxClass details.
	 * 
	 * @param taxClassCode
	 * @param taxClassUpdateDto
	 * @return
	 */
	TaxClassDto updateTaxClass(String taxClassCode, @Valid TaxClassUpdateDto taxClassUpdateDto);
}
