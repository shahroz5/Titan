/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.StateLiteDto;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.store.service.EngineService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("storeEngineService")
public class EngineServiceImpl implements EngineService {

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Override
	@Cacheable(value = "stateMapCache")
	public Map<String, String> getStateDetailsMap() {

		LocationCacheDto location = engineServiceClient.getStoreLocation(CommonUtil.getStoreCode());
		String countryCode = location.getCountryCode();
		List<StateLiteDto> stateList = engineServiceClient
				.listStatelite(countryCode, false, PageRequest.of(0, Integer.MAX_VALUE)).getResults();

		Map<String, String> stateCodeWithDescription = new HashMap<>();
		stateList.forEach(state -> stateCodeWithDescription.put(state.getStateId(), state.getDescription()));

		return stateCodeWithDescription;
	}

}
