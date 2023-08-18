/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.MetalPriceLocationHistoryDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MetalPriceLocationHistorySyncDtoExt extends MetalPriceLocationHistorySyncDto {

	public MetalPriceLocationHistorySyncDtoExt() {

	}

	public MetalPriceLocationHistorySyncDtoExt(MetalPriceLocationHistoryDaoExt metalPriceLocationHistoryDaoExt) {

		MapperUtil.getObjectMapping(metalPriceLocationHistoryDaoExt, this);
		this.setMetalPriceConfig(metalPriceLocationHistoryDaoExt.getMetalPriceConfig().getId());
		this.setLocation(metalPriceLocationHistoryDaoExt.getLocation().getLocationCode());
		this.setMarket(metalPriceLocationHistoryDaoExt.getMarket().getMarketCode());

	}

	public List<MetalPriceLocationHistorySyncDtoExt> getSyncDtoList(List<MetalPriceLocationHistoryDaoExt> daoList) {
		List<MetalPriceLocationHistorySyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			MetalPriceLocationHistorySyncDtoExt syncDto = new MetalPriceLocationHistorySyncDtoExt(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}
}
