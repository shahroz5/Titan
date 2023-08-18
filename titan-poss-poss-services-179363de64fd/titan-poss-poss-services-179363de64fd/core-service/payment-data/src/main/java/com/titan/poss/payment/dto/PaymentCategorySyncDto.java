/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.math.BigDecimal;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PaymentCategoryDao;
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
public class PaymentCategorySyncDto extends MasterSyncableEntity {

	private String paymentCategoryName;

	private String payment;

	private String instrumentNumber;

	private String redemptionType;

	private BigDecimal minimumAmount;

	private String instrumentType;

	private String description;

	public PaymentCategorySyncDto() {

	}

	public PaymentCategorySyncDto(PaymentCategoryDao paymentCategoryDao) {
		MapperUtil.getObjectMapping(paymentCategoryDao, this);
		this.setPayment(paymentCategoryDao.getPayment().getPaymentCode());
	}

	public PaymentCategoryDao getPaymentCategoryDao(PaymentCategorySyncDto paymentCategorySyncDto) {
		PaymentCategoryDao paymentCategoryDao = (PaymentCategoryDao) MapperUtil.getObjectMapping(paymentCategorySyncDto, new PaymentCategoryDao());

		PaymentDao paymentDao = new PaymentDao();
		paymentDao.setPaymentCode(paymentCategorySyncDto.getPayment());

		paymentCategoryDao.setPayment(paymentDao);

		return paymentCategoryDao;
	}
}
