/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.LocationPriceGroupMappingDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class LocationPriceGroupMappingSyncDto extends MasterSyncableEntity {

	private String id;
	
	private String location;

	private String pricingGroupType;

	private String priceGroup;
	
	public LocationPriceGroupMappingDao getLocationPriceGroupMappingDao(LocationPriceGroupMappingSyncDto syncDto) {
		LocationPriceGroupMappingDao locationPriceGroupMappingDao = (LocationPriceGroupMappingDao) MapperUtil.getObjectMapping(syncDto, new LocationPriceGroupMappingDao());
		
		LocationDao locationDao = new LocationDao();
		locationDao.setLocationCode(syncDto.getLocation());
		
		locationPriceGroupMappingDao.setLocation(locationDao);
		
		return locationPriceGroupMappingDao;
	}
	
	public List<LocationPriceGroupMappingDao> getDao(List<LocationPriceGroupMappingSyncDto> syncDtoList){
		List<LocationPriceGroupMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			LocationPriceGroupMappingSyncDto dto = new LocationPriceGroupMappingSyncDto();			
			daoList.add(dto.getLocationPriceGroupMappingDao(syncDto));
		});
		
		return daoList;
	}
	
}
