/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PaymentProductDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentProductSyncDtoExt extends PaymentProductSyncDto {

	private static final long serialVersionUID = 1L;

	public PaymentProductSyncDtoExt() {

	}

	public PaymentProductSyncDtoExt(PaymentProductDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setPaymentCategoryDao(daoExt.getPaymentCategoryDao().getPaymentCategoryName());
	}

	public List<PaymentProductSyncDtoExt> getSyncDtoList(List<PaymentProductDaoExt> daoExtList) {
		List<PaymentProductSyncDtoExt> syncDtoList = new ArrayList<>();
		daoExtList.forEach(dao ->syncDtoList.add(new PaymentProductSyncDtoExt(dao)));
		return syncDtoList;
	}
}
