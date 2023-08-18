/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.service;

import javax.validation.Valid;

import org.springframework.stereotype.Service;

import com.titan.poss.location.dto.request.MetalPriceConfigRequest;
import com.titan.poss.location.dto.request.MetalPriceStagingRequestDto;
import com.titan.poss.location.dto.response.LocationPriceResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("locationPriceService")
public interface PriceService {
	/**
	 * @param metalPriceRequest
	 * @return
	 */
	public LocationPriceResponse updateMetalConfig(@Valid MetalPriceConfigRequest metalPriceRequest);

	/**
	 * @param marketMateriaDto
	 */
	public LocationPriceResponse updateMetalPriceMapping(MetalPriceStagingRequestDto marketMetalPriceDto);

}
