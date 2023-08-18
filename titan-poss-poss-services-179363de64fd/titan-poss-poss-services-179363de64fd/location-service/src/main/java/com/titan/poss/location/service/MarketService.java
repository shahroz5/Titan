/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.MarketUcpPriceMappingDto;
import com.titan.poss.location.dto.request.MarketMarkupMappingRequestDto;
import com.titan.poss.location.dto.request.MarketUpdateDto;
import com.titan.poss.location.dto.response.MarketMarkupListMappingResponseDto;
import com.titan.poss.location.dto.response.MarketMarkupMappingResponseDto;
import com.titan.poss.location.dto.response.MarketUcpPriceMappingResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface MarketService {

	/**
	 * This method will return the list of Market details based on the isActive.
	 * 
	 * @param marketCodes
	 * @param stateCode
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<MarketExtendedDto>>
	 */
	PagedRestResponse<List<MarketDto>> listMarket(List<String> marketCodes, Boolean isActive, Boolean isPageable,
			Pageable pageable);

	/**
	 * This method will return the Market details based on the marketCode.
	 * 
	 * @param marketCode
	 * @return MarketDto
	 */
	MarketDto getMarket(String marketCode);

	/**
	 * This method will save the Market details.
	 * 
	 * @param marketDto
	 * @return MarketDto
	 */
	MarketDto addMarket(MarketDto marketDto);

	/**
	 * This method will update the Market details.
	 * 
	 * @param marketCode
	 * @param marketDto
	 * @return MarketDto
	 */
	MarketDto updateMarket(String marketCode, @Valid MarketUpdateDto marketUpdateDto);

	MarketMarkupMappingResponseDto addMarketMarkupMapping(String marketCode,
			MarketMarkupMappingRequestDto marketMateriaDto);

	PagedRestResponse<List<MarketMarkupListMappingResponseDto>> listMarketMarkupMapping(List<String> marketCodes,
			Boolean isActive, Pageable pageable);

	MarketMarkupMappingResponseDto getMarketMarkupMapping(String marketCode);

	MarketMarkupMappingResponseDto updateMarketMarkupMappping(String marketCode,
			MarketMarkupMappingRequestDto marketUpdateDto);

	/**
	 * This method will add UCP price for the market.
	 * 
	 * @param marketUcpPriceMappingDto
	 * @return MarketUcpPriceMappingResponseDto
	 */
	MarketUcpPriceMappingResponseDto addMarketUcpPriceMapping(MarketUcpPriceMappingDto marketUcpPriceMappingDto);

	/**
	 * This method is used to list market UCP price details.
	 * 
	 * @param marketCode
	 * @param productGroupCode
	 * @param pageable
	 * @return PagedRestResponse<List<MarketUcpPriceMappingResponseDto>>
	 */
	PagedRestResponse<List<MarketUcpPriceMappingResponseDto>> listMarketUcpPriceMapping(String marketCode,
			String productGroupCode, Pageable pageable);

	/**
	 * This method is used to get market UCP price details based on id.
	 * 
	 * @param id
	 * @return MarketUcpPriceMappingResponseDto
	 */
	MarketUcpPriceMappingResponseDto getMarketUcpPriceMapping(String id);

	/**
	 * This method is used to update market UCP price details based on id.
	 * 
	 * @param id
	 * @param marketUcpPriceMappingDto
	 * @return MarketUcpPriceMappingResponseDto
	 */
	MarketUcpPriceMappingResponseDto updateMarketUcpPriceMapping(String id,
			MarketUcpPriceMappingDto marketUcpPriceMappingDto);

	void updateMarketMarkupMappingAmount();

}
