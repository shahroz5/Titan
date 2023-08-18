/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.StateDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class StateSyncDtoExt extends StateSyncDto {
	
	public StateSyncDtoExt() {
		
	}
	
	public StateSyncDtoExt(StateDaoExt stateNewDaoExt) {
		
		MapperUtil.getObjectMapping(stateNewDaoExt, this);
		this.setCountry(stateNewDaoExt.getCountry().getCountryCode());
		
	}
	
	public List<StateSyncDtoExt> getSyncDtoList(List<StateDaoExt> daoList) {
		List<StateSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			StateSyncDtoExt syncDto = new StateSyncDtoExt(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}
}
