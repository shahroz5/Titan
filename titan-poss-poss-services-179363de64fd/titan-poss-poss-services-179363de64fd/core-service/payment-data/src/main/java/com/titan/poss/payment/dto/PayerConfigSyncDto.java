/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PayerConfigDao;
import com.titan.poss.payment.dao.PaymentDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class PayerConfigSyncDto extends MasterSyncableEntity {

	private String id;

	private String description;

	private String payment;

	private String paymentDetails;

	public PayerConfigDao getPayerConfigDao(PayerConfigSyncDto syncDto) {
		PayerConfigDao payerConfigDao = (PayerConfigDao) MapperUtil.getObjectMapping(syncDto, new PayerConfigDao());

		PaymentDao paymentDao = new PaymentDao();
		paymentDao.setPaymentCode(syncDto.getPayment());

		payerConfigDao.setPayment(paymentDao);

		return payerConfigDao;
	}

}
