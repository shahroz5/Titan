/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MarketMarkupMappingDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class MarketMarkupMappingSyncDto extends SyncableEntity {

	private String id;

	private String metalTypeCode;

	private BigDecimal markupFactor;

	private BigDecimal addAmount;

	private BigDecimal deductAmount;

	private String currencyCode;

	private String market;

	public MarketMarkupMappingDao getMarketMarkupMappingDao(MarketMarkupMappingSyncDto marketMarkupSyncDto) {

		MarketMarkupMappingDao marketMarkupMappingDao = new MarketMarkupMappingDao();
		marketMarkupMappingDao = (MarketMarkupMappingDao) MapperUtil.getObjectMapping(marketMarkupSyncDto,
				marketMarkupMappingDao);

		MarketDao marketDao = new MarketDao();
		marketDao.setMarketCode(marketMarkupSyncDto.getMarket());

		marketMarkupMappingDao.setMarket(marketDao);

		return marketMarkupMappingDao;
	}

	public List<MarketMarkupMappingDao> getDaoList(List<MarketMarkupMappingSyncDto> syncDtos) {
		List<MarketMarkupMappingDao> daos = new ArrayList<>();
		syncDtos.forEach(dto -> {
			MarketMarkupMappingSyncDto syncDto = new MarketMarkupMappingSyncDto();
			daos.add(syncDto.getMarketMarkupMappingDao(dto));
		});
		return daos;
	}
}
