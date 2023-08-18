/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigProductMappingDaoExt;
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
public class ExchangeConfigProductSyncDtoExt extends ExchangeConfigProductSyncDto {

	private static final long serialVersionUID = 1L;

	public ExchangeConfigProductSyncDtoExt() {

	}

	public ExchangeConfigProductSyncDtoExt(ExchangeConfigProductMappingDaoExt gepConfigProductMapping) {
		MapperUtil.getObjectMapping(gepConfigProductMapping, this);
		if (gepConfigProductMapping.getExchangeConfig() != null) {
			this.setGepConfig(gepConfigProductMapping.getExchangeConfig().getConfigId());
		} else {
			this.setGepConfig(null);
		}
		if (gepConfigProductMapping.getRange() != null) {
			this.setRange(gepConfigProductMapping.getRange().getId());
		} else {
			this.setRange(null);
		}
	}

	public List<ExchangeConfigProductSyncDtoExt> getSyncDtoList(List<ExchangeConfigProductMappingDaoExt> daoList) {
		List<ExchangeConfigProductSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			ExchangeConfigProductSyncDtoExt syncDto = new ExchangeConfigProductSyncDtoExt(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}
}
