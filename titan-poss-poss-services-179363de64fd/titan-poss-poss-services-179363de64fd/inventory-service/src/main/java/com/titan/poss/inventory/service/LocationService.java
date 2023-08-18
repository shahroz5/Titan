/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.inventory.dto.response.LocationHeaderDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface LocationService {

	Map<String, LocationHeaderDto> getIBTLocations(String regionType, List<String> ownerTypeCodes,
			List<String> locationTypes) throws IOException;

}
