/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.file.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.PriceDao;
import com.titan.poss.product.sync.dto.PriceSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class PriceSyncDtoExt extends PriceSyncDto{

public PriceSyncDtoExt() {
		
	}
	public PriceSyncDtoExt(PriceDao priceDao) {
		MapperUtil.getObjectMapping(priceDao, this);
		this.setPriceGroup(priceDao.getPriceGroup().getPriceGroup());
		this.setItem(priceDao.getItem().getItemCode());
	}
	
	public List<PriceSyncDtoExt> getSyncDtoExtList(List<PriceDao> complexityPriceGroupDao) {
		List<PriceSyncDtoExt> dtoList = new ArrayList<>();
		complexityPriceGroupDao.forEach(complexityPriceGroup -> {
			PriceSyncDtoExt syncDto = new PriceSyncDtoExt(complexityPriceGroup);
			dtoList.add(syncDto);
		});
		
		return dtoList;
	}
}
