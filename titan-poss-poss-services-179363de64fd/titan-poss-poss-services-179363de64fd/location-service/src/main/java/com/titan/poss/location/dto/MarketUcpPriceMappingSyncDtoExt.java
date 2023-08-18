/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.MarketUcpPriceMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class MarketUcpPriceMappingSyncDtoExt extends MarketUcpPriceMappingSyncDto {

	public MarketUcpPriceMappingSyncDtoExt() {
		
	}

	public MarketUcpPriceMappingSyncDtoExt(MarketUcpPriceMappingDaoExt marketUcpPriceMappingDaoExt) {
		MapperUtil.getObjectMapping(marketUcpPriceMappingDaoExt, this);
		this.setMarket(marketUcpPriceMappingDaoExt.getMarketDao().getMarketCode());
	}

	public List<MarketUcpPriceMappingSyncDtoExt> getSyncDtoExtList(
			List<MarketUcpPriceMappingDaoExt> marketUcpPriceMappingList) {
		List<MarketUcpPriceMappingSyncDtoExt> dtoList = new ArrayList<>();
		marketUcpPriceMappingList.forEach(marketUcpPriceMapping -> {
			MarketUcpPriceMappingSyncDtoExt syncDto = new MarketUcpPriceMappingSyncDtoExt(marketUcpPriceMapping);
			dtoList.add(syncDto);
		});

		return dtoList;
	}
}
