/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.StateDao;
import com.titan.poss.location.dao.TownDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class TownSyncDto extends MasterSyncableEntity {

	private String townId;

	private String state;

	private String description;
	
    private Integer eghsRefTownId;
	
	public TownSyncDto() {
		
	}
	
	public TownSyncDto(TownDao town) {
		MapperUtil.getObjectMapping(town, this);
		this.setState(town.getState().getStateId());
	}
	
	public TownDao getTownDao(TownSyncDto townSyncDto) {
		TownDao town = (TownDao) MapperUtil.getObjectMapping(townSyncDto, new TownDao());
		StateDao stateDao = new StateDao();
		stateDao.setStateId(townSyncDto.getState());
		town.setState(stateDao);
		return town;
	}
}
