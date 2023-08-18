/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.dto.CountryDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.request.CountryCreateDto;
import com.titan.poss.location.dto.request.CountryUpdateDto;
import com.titan.poss.location.dto.response.CountryLiteDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface CountryService {

	/**
	 * This method will return the list of Country details based on the isActive.
	 * 
	 * @param isActive
	 * @param description
	 * @param pageable
	 * @return PagedRestResponse<List<CountryDto>>
	 */
	PagedRestResponse<List<CountryDto>> listCountry(Boolean isActive, String description, Pageable pageable);

	/**
	 * This method will return the Country details based on the countryCode.
	 * 
	 * @param countryCode
	 * @return CountryDto
	 */
	CountryDto getCountry(String countryCode);

	/**
	 * This method will save the Country details.
	 * 
	 * @param countryDto
	 * @return CountryDto
	 */
	CountryDto addCountry(CountryCreateDto countryDto);

	/**
	 * This method will update the country details.
	 * 
	 * @param countryCode
	 * @param countryUpdateDto
	 * @return
	 */
	CountryDto updateCountry(String countryCode, CountryUpdateDto countryUpdateDto);

	/**
	 * @param countryCode
	 * @param isPageable
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<CountryLiteDto>> getCountryLite(Boolean isPageable, Pageable pageable);

}
