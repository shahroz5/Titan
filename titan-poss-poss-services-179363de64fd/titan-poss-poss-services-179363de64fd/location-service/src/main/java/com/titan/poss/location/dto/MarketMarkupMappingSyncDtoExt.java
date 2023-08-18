/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.MarketMarkupMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class MarketMarkupMappingSyncDtoExt extends MarketMarkupMappingSyncDto {

	public MarketMarkupMappingSyncDtoExt() {

	}

	public MarketMarkupMappingSyncDtoExt(MarketMarkupMappingDaoExt marketMarkupMappingDaoExt) {
		MapperUtil.getObjectMapping(marketMarkupMappingDaoExt, this);
		this.setMarket(marketMarkupMappingDaoExt.getMarket().getMarketCode());
	}

	public List<MarketMarkupMappingSyncDtoExt> getSyncDtoList(List<MarketMarkupMappingDaoExt> daoList) {
		List<MarketMarkupMappingSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			MarketMarkupMappingSyncDtoExt marketMarkupMappingSyncDtoExt = new MarketMarkupMappingSyncDtoExt(dao);
			syncDtoList.add(marketMarkupMappingSyncDtoExt);
		});

		return syncDtoList;
	}

}
