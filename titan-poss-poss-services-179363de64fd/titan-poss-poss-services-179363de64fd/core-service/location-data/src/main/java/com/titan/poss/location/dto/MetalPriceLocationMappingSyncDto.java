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
import com.titan.poss.location.dao.MetalPriceLocationMappingDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MetalPriceLocationMappingSyncDto extends AuditableEntity {

	private String id;

	private String metalPriceConfig;

	private String metalTypeCode;

	private BigDecimal metalRate;

	private String location;

	private Date applicableDate;

	private String market;

	private String currencyCode;

	private Long syncTime;

	public MetalPriceLocationMappingDao getDao(MetalPriceLocationMappingSyncDto syncDto) {
		MetalPriceLocationMappingDao metalPriceLocationMappingDao = (MetalPriceLocationMappingDao) MapperUtil
				.getObjectMapping(syncDto, new MetalPriceLocationMappingDao());

		MetalPriceConfigDao metalPriceConfigDao = new MetalPriceConfigDao();
		metalPriceConfigDao.setId(syncDto.getMetalPriceConfig());

		metalPriceLocationMappingDao.setMetalPriceConfig(metalPriceConfigDao);

		LocationDao locationDao = new LocationDao();
		locationDao.setLocationCode(syncDto.getLocation());

		metalPriceLocationMappingDao.setLocation(locationDao);

		MarketDao marketDao = new MarketDao();
		marketDao.setMarketCode(syncDto.getMarket());

		metalPriceLocationMappingDao.setMarket(marketDao);

		return metalPriceLocationMappingDao;
	}

	public List<MetalPriceLocationMappingDao> getDaoList(List<MetalPriceLocationMappingSyncDto> dtoList) {
		List<MetalPriceLocationMappingDao> daoList = new ArrayList<>();
		dtoList.forEach(dto -> {
			MetalPriceLocationMappingSyncDto syncDto = new MetalPriceLocationMappingSyncDto();
			daoList.add(syncDto.getDao(dto));
		});
		return daoList;
	}
}
