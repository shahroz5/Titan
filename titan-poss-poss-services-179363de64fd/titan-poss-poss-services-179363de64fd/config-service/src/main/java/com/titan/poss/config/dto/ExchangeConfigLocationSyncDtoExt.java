/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigLocationMappingDaoExt;
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
public class ExchangeConfigLocationSyncDtoExt extends ExchangeConfigLocationSyncDto {

	private static final long serialVersionUID = 1L;

	public ExchangeConfigLocationSyncDtoExt() {

	}

	public ExchangeConfigLocationSyncDtoExt(ExchangeConfigLocationMappingDaoExt gepConfigLocationMapping) {
		MapperUtil.getObjectMapping(gepConfigLocationMapping, this);
		if (gepConfigLocationMapping.getExchangeConfig() != null) {
			this.setGepConfig(gepConfigLocationMapping.getExchangeConfig().getConfigId());
		} else {
			this.setGepConfig(null);
		}
	}

	public List<ExchangeConfigLocationSyncDtoExt> getSyncDtoList(List<ExchangeConfigLocationMappingDaoExt> daoList) {
		List<ExchangeConfigLocationSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			ExchangeConfigLocationSyncDtoExt syncDto = new ExchangeConfigLocationSyncDtoExt(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}
}
