/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.LocationLovDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class LocationLovSyncDto extends MasterSyncableEntity {

	private String id;

	private String lovType;

	private String code;

	private String value;

	public LocationLovDao getLocLovDao(LocationLovSyncDto locationLovSyncDto) {
		return (LocationLovDao) MapperUtil.getObjectMapping(locationLovSyncDto, new LocationLovDao());
	}

	public List<LocationLovDao> getDaoList(List<LocationLovSyncDto> syncDtos) {

		List<LocationLovDao> daos = new ArrayList<>();

		syncDtos.forEach(dto -> {
			LocationLovSyncDto syncDto = new LocationLovSyncDto();
			daos.add(syncDto.getLocLovDao(dto));
		});
		return daos;
	}
}
