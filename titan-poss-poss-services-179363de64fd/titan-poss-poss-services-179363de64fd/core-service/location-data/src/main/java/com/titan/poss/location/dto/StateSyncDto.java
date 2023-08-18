/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.StateDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class StateSyncDto extends MasterSyncableEntity {

	private String stateId;

	private String description;

	private String stateCode;

	private String country;

	private String configDetails;

	private Boolean isUnionTerritory;

	private Integer stateTaxCode;
	
    private Integer eghsRefStateId;

	public StateSyncDto() {

	}

	public StateSyncDto(StateDao state) {
		MapperUtil.getObjectMapping(state, this);
		this.country = state.getCountry().getCountryCode();
	}

	public StateDao getStateNewDao(StateSyncDto stateSyncDto) {
		StateDao state = new StateDao();
		state = (StateDao) MapperUtil.getObjectMapping(stateSyncDto, state);

		CountryDao countryDao = new CountryDao();
		countryDao.setCountryCode(stateSyncDto.getCountry());

		state.setCountry(countryDao);
		return state;
	}
}
