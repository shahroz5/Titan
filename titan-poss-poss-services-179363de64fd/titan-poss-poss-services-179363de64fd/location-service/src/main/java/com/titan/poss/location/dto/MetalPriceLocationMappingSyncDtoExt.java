/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.MetalPriceLocationMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class MetalPriceLocationMappingSyncDtoExt extends MetalPriceLocationMappingSyncDto {

	public MetalPriceLocationMappingSyncDtoExt() {

	}

	public MetalPriceLocationMappingSyncDtoExt(MetalPriceLocationMappingDaoExt materialPriceLocationMappingDaoExt) {

		MapperUtil.getObjectMapping(materialPriceLocationMappingDaoExt, this);
		this.setMetalPriceConfig(materialPriceLocationMappingDaoExt.getMetalPriceConfig().getId());
		this.setLocation(materialPriceLocationMappingDaoExt.getLocation().getLocationCode());
		this.setMarket(materialPriceLocationMappingDaoExt.getMarket().getMarketCode());

	}

	public List<MetalPriceLocationMappingSyncDtoExt> getSyncDtoList(List<MetalPriceLocationMappingDaoExt> daoList) {
		List<MetalPriceLocationMappingSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			MetalPriceLocationMappingSyncDtoExt syncDto = new MetalPriceLocationMappingSyncDtoExt(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}
}
