/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
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
public class PaymentSyncDto extends MasterSyncableEntity {

	private String paymentCode;

	private String description;

	private String paymentGroup;

	private String fieldDetails;

	private Boolean isEditable;

	private Boolean customerDependent;

	private String oracleMapping;

	public PaymentSyncDto() {

	}

	public PaymentSyncDto(PaymentDao paymentDao) {
		MapperUtil.getObjectMapping(paymentDao, this);
	}

	public PaymentDao getPaymentDao(PaymentSyncDto paymentSyncDto) {
		return (PaymentDao) MapperUtil.getObjectMapping(paymentSyncDto, new PaymentDao());
	}

}
