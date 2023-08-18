/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.StateTaxMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class StateTaxMappingSyncDtoExt extends StateTaxMappingSyncDto {

	public StateTaxMappingSyncDtoExt() {

	}

	public StateTaxMappingSyncDtoExt(StateTaxMappingDaoExt stateTaxMappingDaoExt) {
		MapperUtil.getObjectMapping(stateTaxMappingDaoExt, this);
		this.setState(stateTaxMappingDaoExt.getState().getStateId());
	}

	public List<StateTaxMappingSyncDtoExt> getSyncDtoList(List<StateTaxMappingDaoExt> dtoList) {
		List<StateTaxMappingSyncDtoExt> syncDtoList = new ArrayList<>();
		dtoList.forEach(dto -> {
			StateTaxMappingSyncDtoExt stateTaxMappingSyncDtoExt = new StateTaxMappingSyncDtoExt(dto);
			syncDtoList.add(stateTaxMappingSyncDtoExt);
		});

		return syncDtoList;
	}
}
