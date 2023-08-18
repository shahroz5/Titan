/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class DiscountDetailsSyncDtoExt extends DiscountDetailsSyncDto {

	public DiscountDetailsSyncDtoExt() {

	}

	public DiscountDetailsSyncDtoExt(DiscountDetailsDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if (daoExt.getSalesTxn() != null)
			this.setSalesTxn(daoExt.getSalesTxn().getId());
		if (daoExt.getDiscountConfig() != null)
			this.setDiscountConfig(daoExt.getDiscountConfig().getId());
		if (daoExt.getRefPayment() != null)
			this.setRefPayment(daoExt.getRefPayment().getId());
	}
}
