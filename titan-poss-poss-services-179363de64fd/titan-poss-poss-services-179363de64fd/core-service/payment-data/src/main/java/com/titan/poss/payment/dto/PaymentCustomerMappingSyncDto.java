/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.PaymentCustomerMappingDao;
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
public class PaymentCustomerMappingSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String configId;

	private String customerType;

	private String transactionType;

	public PaymentCustomerMappingDao getPaymentCustomerMappingDao(PaymentCustomerMappingSyncDto syncDto) {
		PaymentCustomerMappingDao paymentCustomerMapping = (PaymentCustomerMappingDao) MapperUtil
				.getObjectMapping(syncDto, new PaymentCustomerMappingDao());
		ConfigDao configDao = new ConfigDao();
		configDao.setConfigId(syncDto.getConfigId());

		TransactionDao txnDao = new TransactionDao();
		txnDao.setTransactionType(syncDto.getTransactionType());
		paymentCustomerMapping.setTransactionDao(txnDao);

		paymentCustomerMapping.setConfigId(configDao);
		return paymentCustomerMapping;
	}

	public List<PaymentCustomerMappingDao> getPaymentCustomerMappingDaoList(
			List<PaymentCustomerMappingSyncDto> syncDtoList) {
		List<PaymentCustomerMappingDao> paymentCustomerList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			PaymentCustomerMappingSyncDto dto = new PaymentCustomerMappingSyncDto();
			paymentCustomerList.add(dto.getPaymentCustomerMappingDao(syncDto));
		});
		return paymentCustomerList;
	}

}
