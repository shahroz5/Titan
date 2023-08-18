/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.AuditableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MetalPriceConfigDao;
import com.titan.poss.location.dao.MetalPriceLocationHistoryDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MetalPriceLocationHistorySyncDto extends AuditableEntity {

	private String id;

	private String metalPriceConfig;

	private String metalTypeCode;

	private BigDecimal metalRate;

	private String location;

	private Date applicableDate;

	private String market;

	private String currencyCode;

	public MetalPriceLocationHistoryDao getDao(MetalPriceLocationHistorySyncDto syncDto) {
		MetalPriceLocationHistoryDao metalPriceLocationHistoryDao = (MetalPriceLocationHistoryDao) MapperUtil
				.getObjectMapping(syncDto, new MetalPriceLocationHistoryDao());

		MetalPriceConfigDao metalPriceConfigDao = new MetalPriceConfigDao();
		metalPriceConfigDao.setId(syncDto.getMetalPriceConfig());

		metalPriceLocationHistoryDao.setMetalPriceConfig(metalPriceConfigDao);

		LocationDao locationDao = new LocationDao();
		locationDao.setLocationCode(syncDto.getLocation());

		metalPriceLocationHistoryDao.setLocation(locationDao);

		MarketDao marketDao = new MarketDao();
		marketDao.setMarketCode(syncDto.getMarket());

		metalPriceLocationHistoryDao.setMarket(marketDao);

		return metalPriceLocationHistoryDao;
	}

	public List<MetalPriceLocationHistoryDao> getDaoList(List<MetalPriceLocationHistorySyncDto> dtoList) {
		List<MetalPriceLocationHistoryDao> daoList = new ArrayList<>();
		dtoList.forEach(dto -> {
			MetalPriceLocationHistorySyncDto syncDto = new MetalPriceLocationHistorySyncDto();
			daoList.add(syncDto.getDao(dto));
		});
		return daoList;
	}
}
