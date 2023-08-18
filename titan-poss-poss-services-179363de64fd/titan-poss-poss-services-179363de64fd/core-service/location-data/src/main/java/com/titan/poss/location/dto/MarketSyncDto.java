/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.MarketDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MarketSyncDto extends MasterSyncableEntity {
	
	private String marketCode;

	private String description;
	
	public MarketSyncDto() {
		
	}
	
	public MarketSyncDto(MarketDao market) {
		MapperUtil.getObjectMapping(market, this);
	}
	public MarketDao getMarketDao(MarketSyncDto marketSyncDto) {
		
		return (MarketDao) MapperUtil.getObjectMapping(marketSyncDto, new MarketDao());
	}
}
