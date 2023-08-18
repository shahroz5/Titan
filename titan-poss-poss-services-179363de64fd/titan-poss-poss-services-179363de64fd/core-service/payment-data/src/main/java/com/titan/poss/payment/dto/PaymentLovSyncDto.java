/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PaymentLovDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentLovSyncDto extends MasterSyncableEntity {

	private String id;

	private String lovType;

	private String code;

	private String value;

	public PaymentLovDao getPaymentLovDao(PaymentLovSyncDto paymentLovSyncDto) {
		return (PaymentLovDao) MapperUtil.getObjectMapping(paymentLovSyncDto, new PaymentLovDao());
	}

	public List<PaymentLovDao> getPaymentLovDaoList(List<PaymentLovSyncDto> syncDtoList) {
		List<PaymentLovDao> daoList = new ArrayList<>();
		for (PaymentLovSyncDto lovSyncDto : syncDtoList) {
			PaymentLovSyncDto syncDto = new PaymentLovSyncDto();
			daoList.add(syncDto.getPaymentLovDao(lovSyncDto));
		}
		return daoList;
	}
}
