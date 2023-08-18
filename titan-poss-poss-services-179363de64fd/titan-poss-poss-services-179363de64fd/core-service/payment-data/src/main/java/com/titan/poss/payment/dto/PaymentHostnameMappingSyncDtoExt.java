/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PaymentHostnameMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentHostnameMappingSyncDtoExt extends PaymentHostnameMappingSyncDto {

	public PaymentHostnameMappingSyncDtoExt() {

	}

	public PaymentHostnameMappingSyncDtoExt(PaymentHostnameMappingDaoExt paymentHostnameMappingDao) {
		MapperUtil.getObjectMapping(paymentHostnameMappingDao, this);
	}


	public List<PaymentHostnameMappingSyncDtoExt> getSyncDtoList(List<PaymentHostnameMappingDaoExt> daoList) {
		List<PaymentHostnameMappingSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			PaymentHostnameMappingSyncDtoExt syncDto = new PaymentHostnameMappingSyncDtoExt(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}
}
