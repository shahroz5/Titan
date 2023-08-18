/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PayerConfigDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PayerConfigSyncDtoExt extends PayerConfigSyncDto {

	public PayerConfigSyncDtoExt() {

	}

	public PayerConfigSyncDtoExt(PayerConfigDaoExt payerConfigDaoExt) {

		MapperUtil.getObjectMapping(payerConfigDaoExt, this);
		this.setPayment(payerConfigDaoExt.getPayment().getPaymentCode());
	}
}
