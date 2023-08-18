/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GoodsExchangeSyncDtoExt extends GoodsExchangeSyncDto{

	public GoodsExchangeSyncDtoExt() {
		
	}
	
	public GoodsExchangeSyncDtoExt(GoodsExchangeDaoExt goodsExchangeDao) {
		MapperUtil.getObjectMapping(goodsExchangeDao, this);
		if(goodsExchangeDao.getSalesTxn()!=null)
			this.setSalesTxn(goodsExchangeDao.getSalesTxn().getId());
	}
}
