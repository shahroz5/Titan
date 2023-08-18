/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.service;

import java.util.List;
import java.util.Map;

import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationFilterDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface LocationService {

	/**
	 * Returns Location details from inter-service 'location master' call
	 * 
	 * @param locationCode 'location code' field
	 * @param extraCheck   whether to check isActive, ownerType etc
	 * @return LocationResponse location details
	 */
	LocationCacheDto getLocationDetailsFromLocationCode(String locationCode, Boolean extraCheck);

	/**
	 * Returns Region details from inter-service 'location master' call
	 * 
	 * @param regionCode 'region code' field
	 * @return RegionResponse region details
	 */
	void getRegionDetailsFromRegionCode(String regionCode);

	Map<String, List<String>> getLocationByFilter(LocationFilterDto locationFilter);

}
