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
import com.titan.poss.location.dao.MarketUcpPriceMappingDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class MarketUcpPriceMappingSyncDto extends SyncableEntity {

	private String id;

	private String market;

	private String productGroupCode;

	private BigDecimal markupFactor;

	public MarketUcpPriceMappingDao getMarketUcpPriceMappingDao(MarketUcpPriceMappingSyncDto syncDto) {
		MarketUcpPriceMappingDao marketUcpPriceMappingDao = (MarketUcpPriceMappingDao) MapperUtil
				.getObjectMapping(syncDto, new MarketUcpPriceMappingDao());

		MarketDao marketDao = new MarketDao();
		marketDao.setMarketCode(syncDto.getMarket());

		marketUcpPriceMappingDao.setMarketDao(marketDao);

		return marketUcpPriceMappingDao;
	}

	public List<MarketUcpPriceMappingDao> getDao(List<MarketUcpPriceMappingSyncDto> syncDtoList) {
		List<MarketUcpPriceMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			MarketUcpPriceMappingSyncDto dto = new MarketUcpPriceMappingSyncDto();
			daoList.add(dto.getMarketUcpPriceMappingDao(syncDto));
		});

		return daoList;
	}
}
