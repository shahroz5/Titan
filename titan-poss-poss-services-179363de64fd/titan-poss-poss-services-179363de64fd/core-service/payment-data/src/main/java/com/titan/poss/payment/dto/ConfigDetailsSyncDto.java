/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.ConfigDetailsDao;
import com.titan.poss.payment.dao.PaymentDao;
import com.titan.poss.payment.dao.TransactionDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ConfigDetailsSyncDto extends SyncTimeDao {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String id;

	private String configId;

	private String payment;

	private String transactionType;

	private String configDetails;

	public ConfigDetailsDao getConfigDetailsDao(ConfigDetailsSyncDto configDetailsSyncDto) {
		ConfigDetailsDao configDetailsDao = (ConfigDetailsDao) MapperUtil.getObjectMapping(configDetailsSyncDto,
				new ConfigDetailsDao());
		PaymentDao paymentDao = new PaymentDao();
		paymentDao.setPaymentCode(configDetailsSyncDto.getPayment());
		configDetailsDao.setPayment(paymentDao);

		TransactionDao txnDao = new TransactionDao();
		txnDao.setTransactionType(configDetailsSyncDto.getTransactionType());
		configDetailsDao.setTransactionDao(txnDao);

		ConfigDao configDaao = new ConfigDao();
		configDaao.setConfigId(configDetailsSyncDto.getConfigId());
		configDetailsDao.setConfigId(configDaao);
		return configDetailsDao;
	}
}
