/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.sales.service.LocationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("salesLocationService")
public class LocationServiceImpl implements LocationService {

	@Autowired
	EngineServiceClient engineClient;

	@Override
	public LocationCacheDto getLocationDetails(String locationCode) {

		return engineClient.getStoreLocation(locationCode);
	}

}
