/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.StateDao;
import com.titan.poss.location.dao.StateTaxMappingDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class StateTaxMappingSyncDto extends MasterSyncableEntity {

	private String id;

	private String taxComponent;

	private String state;

	private String stateTaxCode;

	private Boolean isActive;

	public StateTaxMappingDao getStateTaxMappingDao(StateTaxMappingSyncDto stateTaxMappingSyncDto) {
		StateTaxMappingDao stateTaxMappingDao = (StateTaxMappingDao) MapperUtil.getObjectMapping(stateTaxMappingSyncDto,
				new StateTaxMappingDao());

		StateDao stateDao = new StateDao();
		stateDao.setStateId(stateTaxMappingSyncDto.getState());

		stateTaxMappingDao.setState(stateDao);

		return stateTaxMappingDao;
	}

	public List<StateTaxMappingDao> getDaoList(List<StateTaxMappingSyncDto> syncDtoList) {
		List<StateTaxMappingDao> daoList = new ArrayList<>();
		for (StateTaxMappingSyncDto syc : syncDtoList) {
			StateTaxMappingSyncDto stateTaxMappingSyncDto = new StateTaxMappingSyncDto();
			daoList.add(stateTaxMappingSyncDto.getStateTaxMappingDao(syc));
		}
		return daoList;
	}
}
