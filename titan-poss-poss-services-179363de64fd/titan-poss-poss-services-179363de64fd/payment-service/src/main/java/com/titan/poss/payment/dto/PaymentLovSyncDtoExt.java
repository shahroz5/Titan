/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PaymentLovDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentLovSyncDtoExt extends PaymentLovSyncDto {

	public PaymentLovSyncDtoExt() {

	}

	public PaymentLovSyncDtoExt(PaymentLovDaoExt paymentLovDao) {
		MapperUtil.getObjectMapping(paymentLovDao, this);
	}

	public List<PaymentLovSyncDtoExt> getLovSyncDtoList(List<PaymentLovDaoExt> lovList) {
		List<PaymentLovSyncDtoExt> lovSyncDtoList = new ArrayList<>();
		for (PaymentLovDaoExt lov : lovList) {
			PaymentLovSyncDtoExt lovSyncDto = new PaymentLovSyncDtoExt(lov);
			lovSyncDtoList.add(lovSyncDto);
		}

		return lovSyncDtoList;
	}
}
