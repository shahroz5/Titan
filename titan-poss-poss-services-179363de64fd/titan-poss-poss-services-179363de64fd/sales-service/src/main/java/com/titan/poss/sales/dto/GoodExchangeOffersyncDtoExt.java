/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.GoodsExchangeOffersDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GoodExchangeOffersyncDtoExt extends GoodExchangeOfferSyncDto{

	public GoodExchangeOffersyncDtoExt() {
		
	}
	public GoodExchangeOffersyncDtoExt(GoodsExchangeOffersDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if(daoExt.getGoodsExchangeDetails()!=null)
			this.setGoodsExchangeDetails(daoExt.getGoodsExchangeDetails().getId());
	}
}
