
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCacheRequestDto;
import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.response.ListResponse;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("ConfigEngineService")
public interface EngineService {

	public ListResponse<LocationCacheDto> getStoreLocationDetails(LocationCacheRequestDto locationCacheRequestDto);

	public ListResponse<ItemLiteDto> getItemList(List<String> itemCodes);

	public Map<String, String> getProductGroups(String isPlainStudded);
	
	public BusinessDayDto getBusinessDay(String locationCode);
	
	public MarketDto getMarketDetails(String marketCode);
	
	public Map<String, String> getProductCategories();

}
