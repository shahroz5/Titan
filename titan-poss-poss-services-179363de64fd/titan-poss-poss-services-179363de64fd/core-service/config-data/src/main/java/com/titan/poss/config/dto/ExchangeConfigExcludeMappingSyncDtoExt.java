/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDaoExt;
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
public class ExchangeConfigExcludeMappingSyncDtoExt extends ExchangeConfigExcludeMappingSyncDto {

	private static final long serialVersionUID = 1L;

	public ExchangeConfigExcludeMappingSyncDtoExt() {

	}

	public ExchangeConfigExcludeMappingSyncDtoExt(ExchangeConfigExcludeMappingDaoExt gepConfigExcludeMapping) {
		MapperUtil.getObjectMapping(gepConfigExcludeMapping, this);
		if (gepConfigExcludeMapping.getExchangeConfig() != null) {
			this.setGepConfig(gepConfigExcludeMapping.getExchangeConfig().getConfigId());
		} else {
			this.setGepConfig(null);
		}
	}

	public List<ExchangeConfigExcludeMappingSyncDtoExt> getSyncDtoList(
			List<ExchangeConfigExcludeMappingDaoExt> daoList) {
		List<ExchangeConfigExcludeMappingSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			ExchangeConfigExcludeMappingSyncDtoExt syncDto = new ExchangeConfigExcludeMappingSyncDtoExt(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}
}
