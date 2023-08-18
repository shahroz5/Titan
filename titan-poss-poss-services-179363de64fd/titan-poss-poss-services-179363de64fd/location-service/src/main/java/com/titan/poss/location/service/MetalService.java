/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.MetalPriceLocationResponse;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.request.MetalBasePriceRequestDto;
import com.titan.poss.location.dto.request.MetalPriceMappingRequestDto;
import com.titan.poss.location.dto.request.json.MetalPriceConfigRequestDto;
import com.titan.poss.location.dto.response.MarketMarkupMappingFactorsDto;
import com.titan.poss.location.dto.response.MetalPriceConfigDto;
import com.titan.poss.location.dto.response.MetalPriceMappingBaseDto;
import com.titan.poss.location.dto.response.MetalPriceMappingResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface MetalService {

	public PagedRestResponse<List<MarketMarkupMappingFactorsDto>> listMarketMarkupMapping(List<String> marketCodes,
			List<String> descriptions, String metalTypeCode, Pageable pageable);

	PagedRestResponse<List<MetalPriceMappingBaseDto>> computeMetalPriceLocationMapping(String metalTypeCode,
			MetalBasePriceRequestDto marketMateriaDto, List<String> filterMarketCodes, List<String> filterLocationCodes,
			Pageable pageable);

	void confirmMetalPriceLocationMapping(String metalTypeCode, MetalPriceMappingRequestDto marketMateriaDto);

	public PagedRestResponse<List<MetalPriceConfigDto>> listMetalPriceConfig(String metalTypeCode,
			MetalPriceConfigRequestDto metalPriceConfigRequestDto, String configId, Pageable pageable);

	public PagedRestResponse<List<MetalPriceMappingResponseDto>> listMetalPriceLocation(String metalTypeCode, String id,
			List<String> marketCodes, List<String> locationCodes, Pageable pageable);

	/**
	 * @param metalPriceLocationgRequestDto
	 * @return
	 */
	MetalPriceLocationResponse listMetalPriceLocationDao(
			@Valid MetalPriceConfigRequestDto metalPriceLocationgRequestDto);

}
