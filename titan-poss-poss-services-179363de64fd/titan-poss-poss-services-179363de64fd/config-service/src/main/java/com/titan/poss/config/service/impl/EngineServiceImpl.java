/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.config.service.EngineService;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCacheRequestDto;
import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Service
public class EngineServiceImpl implements EngineService {

	@Autowired
	EngineServiceClient engineClient;

	@Override
	public ListResponse<LocationCacheDto> getStoreLocationDetails(
			@RequestBody LocationCacheRequestDto locationCacheRequestDto) {
		return engineClient.getStoreLocationDetails(locationCacheRequestDto);

	}

	@Override
	public ListResponse<ItemLiteDto> getItemList(
			@RequestParam(name = "itemCodes", required = true) List<@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String> itemCodes) {
		return engineClient.getItemList(itemCodes);
	}

	@Override
	public Map<String, String> getProductGroups(String isPlainStudded) {
		return engineClient.getProductGroupList(isPlainStudded, null);

	}
	
	@Override
	public Map<String, String> getProductCategories() {
		return engineClient.getProductCategoryList();

	}

	@Override
	public BusinessDayDto getBusinessDay(String locationCode) {
		return engineClient.getBusinessDay(locationCode);
	}

	@Override
	public MarketDto getMarketDetails(String marketCode) {
		return engineClient.getMarketDetails(marketCode);
	}

}
