/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PayeeBankLocationMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PayeeBankLocationSyncDtoExt extends PayeeBankLocationSyncDto {

	private static final long serialVersionUID = 1L;

	public PayeeBankLocationSyncDtoExt() {

	}

	public PayeeBankLocationSyncDtoExt(PayeeBankLocationMappingDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setPayeeBank(daoExt.getPayeeBank().getBankName());
		this.setPayment(daoExt.getPayment().getPaymentCode());
	}

	public List<PayeeBankLocationSyncDtoExt> getSyncDtoList(List<PayeeBankLocationMappingDaoExt> daoExtList) {
		List<PayeeBankLocationSyncDtoExt> syncDtoList = new ArrayList<>();
		daoExtList.forEach(dao -> {
			PayeeBankLocationSyncDtoExt dto = new PayeeBankLocationSyncDtoExt(dao);
			syncDtoList.add(dto);
		});
		return syncDtoList;
	}

}
