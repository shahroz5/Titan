/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.LocationPriceGroupMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class LocationPriceGroupMappingSyncDtoExt extends LocationPriceGroupMappingSyncDto{

	public LocationPriceGroupMappingSyncDtoExt() {
		
	}
	public LocationPriceGroupMappingSyncDtoExt(LocationPriceGroupMappingDaoExt locationPriceGroupMappingDaoExt) {
		MapperUtil.getObjectMapping(locationPriceGroupMappingDaoExt, this);
		this.setLocation(locationPriceGroupMappingDaoExt.getLocation().getLocationCode());
	}
	
	public List<LocationPriceGroupMappingSyncDtoExt> getSyncDtoExtList(List<LocationPriceGroupMappingDaoExt> locationPriceMappingList) {
		List<LocationPriceGroupMappingSyncDtoExt> dtoList = new ArrayList<>();
		locationPriceMappingList.forEach(locationPriceMapping -> {
			LocationPriceGroupMappingSyncDtoExt syncDto = new LocationPriceGroupMappingSyncDtoExt(locationPriceMapping);
			dtoList.add(syncDto);
		});
		
		return dtoList;
	}
}
