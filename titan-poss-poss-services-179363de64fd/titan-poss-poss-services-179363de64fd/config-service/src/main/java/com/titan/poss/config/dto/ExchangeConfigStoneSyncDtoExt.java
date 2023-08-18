/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigStoneMappingDaoExt;
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
public class ExchangeConfigStoneSyncDtoExt extends ExchangeConfigStoneSyncDto {

	private static final long serialVersionUID = 1L;

	public ExchangeConfigStoneSyncDtoExt() {

	}

	public ExchangeConfigStoneSyncDtoExt(ExchangeConfigStoneMappingDaoExt exchangeConfigStone) {
		MapperUtil.getObjectMapping(exchangeConfigStone, this);
		if (exchangeConfigStone.getExchangeConfig() != null) {
			this.setExchangeConfig(exchangeConfigStone.getExchangeConfig().getConfigId());
		} else {
			this.setExchangeConfig(null);
		}
		if (exchangeConfigStone.getRange() != null) {
			this.setRange(exchangeConfigStone.getRange().getId());
		} else {
			this.setRange(null);
		}
	}

	public List<ExchangeConfigStoneSyncDtoExt> getSyncDtoList(List<ExchangeConfigStoneMappingDaoExt> daoList) {
		List<ExchangeConfigStoneSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			ExchangeConfigStoneSyncDtoExt syncDto = new ExchangeConfigStoneSyncDtoExt(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}

}
