/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GoodsExchangeDetailsSyncDtoExt extends GoodsExchangeDetailsSyncDto {

	public GoodsExchangeDetailsSyncDtoExt() {

	}

	public GoodsExchangeDetailsSyncDtoExt(GoodsExchangeDetailsDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setGoodsExchange(daoExt.getGoodsExchange().getId());
		if (daoExt.getCashMemoDetails() != null) {
			this.setCashMemoDetails(daoExt.getCashMemoDetails().getId());
		}
	}
}
