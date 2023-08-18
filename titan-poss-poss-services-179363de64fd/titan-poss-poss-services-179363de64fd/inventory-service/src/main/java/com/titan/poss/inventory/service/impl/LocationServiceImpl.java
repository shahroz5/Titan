/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.LocationServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dto.response.LocationHeaderDto;
import com.titan.poss.inventory.service.LocationService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class LocationServiceImpl implements LocationService {

	@Autowired
	LocationServiceClient locationClient;
	
	@Override
	public Map<String, LocationHeaderDto> getIBTLocations(String regionType, List<String> ownerTypeCodes,
			List<String> locationTypes) throws IOException {
		PagedRestResponse<List<com.titan.poss.core.dto.LocationHeaderDto>> locationHeaderDtoList = locationClient
				.getIBTLocations(regionType, ownerTypeCodes, locationTypes);
		Map<String, LocationHeaderDto> locations = new HashMap<>();
		locationHeaderDtoList.getResults().forEach(locationHeaderDto -> {
			LocationHeaderDto locationDto = new LocationHeaderDto();
			MapperUtil.beanMapping(locationHeaderDto, locationDto);
			locations.put(locationHeaderDto.getLocationCode(), locationDto);
		});
		return locations;
	}
}
