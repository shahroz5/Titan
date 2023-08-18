/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PayerDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PayerDetailsSyncDtoExt extends PayerDetailsSyncDto {
	public PayerDetailsSyncDtoExt() {

	}
	public PayerDetailsSyncDtoExt(PayerDetailsDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setPayerBank(daoExt.getPayerBank().getBankName());
		this.setPayerBankConfig(daoExt.getPayerBankConfig().getId());
	}
}
