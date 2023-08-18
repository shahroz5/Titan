/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PaymentCustomerMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentCustomerMappingSyncDtoExt extends PaymentCustomerMappingSyncDto {

	private static final long serialVersionUID = 1L;

	public PaymentCustomerMappingSyncDtoExt() {

	}

	public PaymentCustomerMappingSyncDtoExt(PaymentCustomerMappingDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setConfigId(daoExt.getConfigId().getConfigId());
		this.setTransactionType(daoExt.getTransactionDao().getTransactionType());
	}

	public List<PaymentCustomerMappingSyncDtoExt> getSyncDtoList(List<PaymentCustomerMappingDaoExt> daoExtList) {
		List<PaymentCustomerMappingSyncDtoExt> syncDtoList = new ArrayList<>();
		daoExtList.forEach(dao -> {
			PaymentCustomerMappingSyncDtoExt dto = new PaymentCustomerMappingSyncDtoExt(dao);
			syncDtoList.add(dto);
		});
		return syncDtoList;
	}

}
