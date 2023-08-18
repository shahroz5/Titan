/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.PriceDaoExt;
import com.titan.poss.product.sync.dto.PriceSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class PriceSyncDtoExt extends PriceSyncDto{

public PriceSyncDtoExt() {
		
	}
	public PriceSyncDtoExt(PriceDaoExt priceDaoExt) {
		MapperUtil.getObjectMapping(priceDaoExt, this);
		this.setPriceGroup(priceDaoExt.getPriceGroup().getPriceGroup());
		this.setItem(priceDaoExt.getItem().getItemCode());
	}
	
	public List<PriceSyncDtoExt> getSyncDtoExtList(List<PriceDaoExt> complexityPriceGroupDaoExt) {
		List<PriceSyncDtoExt> dtoList = new ArrayList<>();
		complexityPriceGroupDaoExt.forEach(complexityPriceGroup -> {
			PriceSyncDtoExt syncDto = new PriceSyncDtoExt(complexityPriceGroup);
			dtoList.add(syncDto);
		});
		
		return dtoList;
	}
}
