/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.HistoryPriceResponse;
import com.titan.poss.core.dto.MetalPriceRequestDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.location.service.EngineService;

/**
 * Service interface for Customer.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("locationEngineService")
public class EngineServiceImpl implements EngineService {

	@Autowired
	EngineServiceClient engineClient;

	@Override
	public ListResponse<HistoryPriceResponse> getStandardHistoryPrice(MetalPriceRequestDto metalPriceRequest) {

		return engineClient.getStandardHistoryPrice(metalPriceRequest);
	}

	@Override
	public CountryDetailsDto getCountryDetails(String locationCode) {
		return engineClient.getCountryDetails(locationCode);
	}

}
