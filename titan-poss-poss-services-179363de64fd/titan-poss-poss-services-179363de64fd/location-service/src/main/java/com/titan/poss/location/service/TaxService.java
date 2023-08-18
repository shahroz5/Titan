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
import com.titan.poss.location.dto.TaxDto;
import com.titan.poss.location.dto.request.TaxUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface TaxService {

	/**
	 * This method will return the list of Tax details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @param taxSystem
	 * @return PagedRestResponse<List<TaxDto>>
	 */
	PagedRestResponse<List<TaxDto>> listTax(Boolean isActive, Pageable pageable, String taxSystem);

	/**
	 * This method will return the Tax details based on the taxCode.
	 * 
	 * @param taxCode
	 * @return TaxDto
	 */
	TaxDto getTax(String taxCode);

	/**
	 * This method will save the Tax details.
	 * 
	 * @param taxDto
	 * @return TaxDto
	 */
	TaxDto addTax(TaxDto taxDto);

	/**
	 * This method will update the Tax details.
	 * 
	 * @param taxCode
	 * @param taxUpdateDto
	 * @return
	 */
	TaxDto updateTax(String taxCode, @Valid TaxUpdateDto taxUpdateDto);
}
