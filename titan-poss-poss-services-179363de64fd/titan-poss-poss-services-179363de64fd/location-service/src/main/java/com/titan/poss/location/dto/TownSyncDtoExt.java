/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.TownDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class TownSyncDtoExt extends TownSyncDto {
	
	public TownSyncDtoExt() {
		
	}
	
	public TownSyncDtoExt(TownDaoExt townNewDaoExt) {
		
		MapperUtil.getObjectMapping(townNewDaoExt, this);
		this.setState(townNewDaoExt.getState().getStateId());
		
	}
	
	public List<TownSyncDtoExt> getSyncDtoList(List<TownDaoExt> daoList) {
		List<TownSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			TownSyncDtoExt syncDto = new TownSyncDtoExt(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}
}
