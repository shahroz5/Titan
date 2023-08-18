/*  
 * Copyright 2019. Titan Company Limited
 * 
 */
package com.titan.poss.user.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationDropDownDto;
import com.titan.poss.core.dto.LocationFilterDto;
import com.titan.poss.core.dto.RegionLiteDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.LocationServiceClient;
import com.titan.poss.user.service.LocationService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("userLocationServiceImpl")
public class LocationServiceImpl implements LocationService {

	@Autowired
	EngineServiceClient engineClient;

	@Autowired
	LocationServiceClient locationServiceClient;

	@Override
//	@Cacheable(key = "#locationCode")
//	@Cacheable(key = "{#locationCode, #extraCheck}")
	public LocationCacheDto getLocationDetailsFromLocationCode(String locationCode, Boolean extraCheck) {

		LocationCacheDto response = engineClient.getStoreLocation(locationCode);

		if (response == null) {
			if (!extraCheck)
				return null;
			throw new ServiceException("store not found for 'location code' provided", "ERR-UAM-052",
					"No locationCode found for: " + locationCode);
		}

		if (!response.getLocationTypeCode().equalsIgnoreCase("BTQ") || StringUtils.isBlank(response.getOwnerTypeCode()))
			throw new ServiceException("Store details not found for name provided", "ERR-UAM-052",
					"LocationCode: " + locationCode + ", locationType: " + response.getLocationTypeCode()
							+ ", ownerType: " + response.getOwnerTypeCode());

		if (BooleanUtils.isFalse(response.getIsActive()))
			throw new ServiceException("Provided location is in deactivated state.", "ERR-UAM-060",
					"isActive? " + response.getIsActive());

		if (StringUtils.isBlank(response.getBrandCode()))
			throw new ServiceException("Provided location does not have any brand code associated with it",
					"ERR-UAM-063", "brandCode: " + response.getBrandCode());

		return response;
	}

	@Override
	public void getRegionDetailsFromRegionCode(String regionCode) {

		PagedRestResponse<List<RegionLiteDto>> dataPagedRestResponse = locationServiceClient.getAllRegion(regionCode,
				null, false);
		if (dataPagedRestResponse.getTotalElements() == 0)
			throw new ServiceException("Region not found or in deactivated state for the 'region code' provided.",
					"ERR-UAM-059", "regionCode: " + regionCode);
	}

	@Override
	public Map<String, List<String>> getLocationByFilter(LocationFilterDto locationFilter) {
		PagedRestResponse<List<LocationDropDownDto>> locationsPagedResponse = locationServiceClient
				.listLocationsDropDown(locationFilter, false);
		Map<String, List<String>> listMap = new HashMap<>();
		if (locationsPagedResponse.getTotalElements() > 0) {
			List<LocationDropDownDto> locationsDto = locationsPagedResponse.getResults();
			for (int i = 0; i < locationsDto.size(); i++) {
				LocationDropDownDto temp = locationsDto.get(i);
				setInMap(listMap, temp.getLocationFormat(), temp.getLocationCode());
			}
		}
		return listMap;
	}

	private void setInMap(Map<String, List<String>> listMap, String key, String val) {

		List<String> values = listMap.get(key);
		if (values == null) {
			listMap.put(key, new ArrayList<>(Arrays.asList(val)));
		} else {
			values.add(val);
			listMap.put(key, values);
		}
	}

}
