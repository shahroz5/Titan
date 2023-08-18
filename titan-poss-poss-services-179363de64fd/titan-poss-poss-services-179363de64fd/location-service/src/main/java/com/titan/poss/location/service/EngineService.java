/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.HistoryPriceResponse;
import com.titan.poss.core.dto.MetalPriceRequestDto;
import com.titan.poss.core.response.ListResponse;

/**
 * Service interface for Engine.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface EngineService {

	/**
	 * This method will get metal rates from history.
	 * 
	 * @param metalPriceRequest
	 * @return ListResponse<HistoryPriceResponse>
	 */
	ListResponse<HistoryPriceResponse> getStandardHistoryPrice(MetalPriceRequestDto metalPriceRequest);

	/**
	 * This method will get the country details for the given location code.
	 * 
	 * @param locationCode
	 * @return CountryDetailsDto
	 */
	CountryDetailsDto getCountryDetails(String locationCode);
}
