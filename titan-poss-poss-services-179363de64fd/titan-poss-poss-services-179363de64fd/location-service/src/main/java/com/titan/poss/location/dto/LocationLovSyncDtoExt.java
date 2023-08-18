/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.LocationLovDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class LocationLovSyncDtoExt extends LocationLovSyncDto {

	public LocationLovSyncDtoExt() {

	}

	public LocationLovSyncDtoExt(LocationLovDaoExt locationLovDaoExt) {
		MapperUtil.getObjectMapping(locationLovDaoExt, this);
	}

	public List<LocationLovSyncDtoExt> getDtoExts(List<LocationLovDaoExt> daoExts) {

		List<LocationLovSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao ->{
			LocationLovSyncDtoExt dto = new LocationLovSyncDtoExt(dao);
			syncDtoExts.add(dto);
		});
		return syncDtoExts;
	}
}
