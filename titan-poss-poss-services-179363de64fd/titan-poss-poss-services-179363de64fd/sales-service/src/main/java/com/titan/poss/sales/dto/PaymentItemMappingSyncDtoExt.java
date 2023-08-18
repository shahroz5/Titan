/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentItemMappingSyncDtoExt extends PaymentItemMappingSyncDto {
	public PaymentItemMappingSyncDtoExt() {

	}

	public PaymentItemMappingSyncDtoExt(PaymentItemMappingDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);

		if (daoExt.getPaymentDetailsDao() != null)
			this.setPaymentDetailsDao(daoExt.getPaymentDetailsDao().getId());
	}
}
