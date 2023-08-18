/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.config.dto.request.ExchangeConfigDetailsRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigLocationsMappingRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigLocationsRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigProductGroupMappingRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigStoneRequestDto;
import com.titan.poss.config.dto.request.ExchangeCreateConfigDto;
import com.titan.poss.config.dto.request.ExchangeUpdateConfigDto;
import com.titan.poss.config.dto.request.GepConfigItemRequestDto;
import com.titan.poss.config.dto.request.GepThemeRequestDto;
import com.titan.poss.config.dto.response.ExchangeConfigDetailsResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigItemThemeMappingResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigLocationsResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigProductGropusResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigStoneResponseDto;
import com.titan.poss.config.dto.response.ExchangeUpdateItemResponseDto;
import com.titan.poss.config.dto.response.ExchangeUpdateThemeResponseDto;
import com.titan.poss.core.dto.MappedConfigResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface ExchangeConfigService {

	PagedRestResponse<List<ExchangeConfigResponseDto>> getExchangeConfigList(String description, String configType,
			Boolean isActive, String itemCode, Pageable pageable);

	ExchangeConfigResponseDto getExchangeConfig(String configId, String configType);

	ExchangeConfigResponseDto createExchangeConfig(ExchangeCreateConfigDto exchangeCreateConfigDto, String configType);

	ExchangeConfigResponseDto updateExchangeConfig(String configId, String configType,
			ExchangeUpdateConfigDto exchangeConfigRequestDto);

	PagedRestResponse<List<ExchangeConfigDetailsResponseDto>> getExchangeConfigDetails(String configId,
			String configType, Pageable pageable);

	ListResponse<ExchangeConfigDetailsResponseDto> updateExchangeConfigDetails(String configId, String configType,
			ExchangeConfigDetailsRequestDto gepConfigDetailsRequestDto);

	ExchangeConfigLocationsRequestDto updateLocationsMapping(String configId, String configType,
			ExchangeConfigLocationsRequestDto exchangeConfigLocationsDto);

	ListResponse<ExchangeConfigProductGropusResponseDto> updateProductMapping(String configId, String configType,
			ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto);

	ListResponse<ExchangeConfigLocationsResponseDto> getLocationsMapping(String configId, String configType);

	PagedRestResponse<List<ExchangeConfigProductGropusResponseDto>> getProductMapping(String configId,
			String configType, String productGroup, String productCategory, Pageable pageable);

	PagedRestResponse<List<ExchangeConfigItemThemeMappingResponseDto>> getItemThemeMapping(String configType,
			Boolean isTheme, String configId, String itemCode, String themeCode, Pageable pageable);

	ListResponse<ExchangeUpdateThemeResponseDto> updateThemes(String configId, String configType,
			GepThemeRequestDto gepThemeRequestDto);

	ListResponse<ExchangeUpdateItemResponseDto> updateItems(String configId, String configType,
			GepConfigItemRequestDto gepItemRequest);

	ListResponse<MappedConfigResponseDto> getLocationsMappingList(String configType,
			ExchangeConfigLocationsMappingRequestDto exchangeConfigLocationsMappingRequestDto);

	PagedRestResponse<List<ExchangeConfigStoneResponseDto>> getExchangeConfigStoneMapping(String configId,
			String configType, String stoneTypeCode, Pageable pageable);

	ListResponse<ExchangeConfigStoneResponseDto> updateStones(String configId, String configType,
			ExchangeConfigStoneRequestDto tepStones);
}
