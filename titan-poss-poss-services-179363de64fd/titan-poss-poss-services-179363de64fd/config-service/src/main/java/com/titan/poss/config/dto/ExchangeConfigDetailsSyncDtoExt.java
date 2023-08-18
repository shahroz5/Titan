/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigDetailsDaoExt;
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
public class ExchangeConfigDetailsSyncDtoExt extends ExchangeConfigDetailsSyncDto {

	private static final long serialVersionUID = 1L;

	public ExchangeConfigDetailsSyncDtoExt() {

	}

	public ExchangeConfigDetailsSyncDtoExt(ExchangeConfigDetailsDaoExt gepConfigDetailsDaoExt) {
		MapperUtil.getObjectMapping(gepConfigDetailsDaoExt, this);
		this.setRange(gepConfigDetailsDaoExt.getRange().getId());
		this.setGepConfig(gepConfigDetailsDaoExt.getExchangeConfig().getConfigId());
	}

	public List<ExchangeConfigDetailsSyncDtoExt> getSyncDtoExtList(List<ExchangeConfigDetailsDaoExt> daoExtList) {
		List<ExchangeConfigDetailsSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExtList.forEach(dao -> {
			ExchangeConfigDetailsSyncDtoExt syncDtoExt = new ExchangeConfigDetailsSyncDtoExt(dao);
			syncDtoExts.add(syncDtoExt);
		});
		return syncDtoExts;
	}
}
