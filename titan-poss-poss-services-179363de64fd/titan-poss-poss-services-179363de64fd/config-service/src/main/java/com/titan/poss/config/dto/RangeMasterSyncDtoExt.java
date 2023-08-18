/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.RangeMasterDaoExt;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class RangeMasterSyncDtoExt extends RangeMasterSyncDto {
	public RangeMasterSyncDtoExt() {

	}

	public RangeMasterSyncDtoExt(RangeMasterDaoExt rangeMasterDao) {
		MapperUtil.getObjectMapping(rangeMasterDao, this);
	}

	public List<RangeMasterSyncDtoExt> getSyncDtoList(List<RangeMasterDaoExt> daos) {

		List<RangeMasterSyncDtoExt> syncDtos = new ArrayList<>();
		daos.forEach(dao -> {
			RangeMasterSyncDtoExt rangeMasterSyncDto = new RangeMasterSyncDtoExt(dao);
			syncDtos.add(rangeMasterSyncDto);
		});
		return syncDtos;
	}
}
