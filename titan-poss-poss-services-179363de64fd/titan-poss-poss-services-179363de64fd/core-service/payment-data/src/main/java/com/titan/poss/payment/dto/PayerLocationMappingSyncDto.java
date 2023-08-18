/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PayerConfigDao;
import com.titan.poss.payment.dao.PayerLocationMappingDao;
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
public class PayerLocationMappingSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String locationCode;

	private String payment;
	
	private String id;
	
	private String  payerBankConfig;
	
	public PayerLocationMappingDao getPayerLocationMappingDao(PayerLocationMappingSyncDto syncDto) {
		PayerLocationMappingDao payerLocationMappingDao = (PayerLocationMappingDao) MapperUtil.getObjectMapping(syncDto, new PayerLocationMappingDao());
		PayerConfigDao payerBnkConfig = new PayerConfigDao();
		payerBnkConfig.setId(syncDto.getPayerBankConfig());
		PaymentDao paymentDao = new PaymentDao();
		paymentDao.setPaymentCode(syncDto.getPayment());
		payerLocationMappingDao.setPayment(paymentDao);
		payerLocationMappingDao.setPayerBankConfig(payerBnkConfig);
		return payerLocationMappingDao;
	}
	
	public List<PayerLocationMappingDao> getPayerLocationMappingDaoList(List<PayerLocationMappingSyncDto> syncDtoList) {
		List<PayerLocationMappingDao> payerLocationMappingDaoList=new ArrayList<>();
		syncDtoList.forEach(syncDto->{
			PayerLocationMappingDao payerLocationMappingDao = (PayerLocationMappingDao) MapperUtil.getObjectMapping(syncDto, new PayerLocationMappingDao());
			PayerConfigDao payerBnkConfig = new PayerConfigDao();
			payerBnkConfig.setId(syncDto.getPayerBankConfig());
			PaymentDao paymentDao = new PaymentDao();
			paymentDao.setPaymentCode(syncDto.getPayment());
			payerLocationMappingDao.setPayment(paymentDao);
			payerLocationMappingDao.setPayerBankConfig(payerBnkConfig);
			payerLocationMappingDaoList.add(payerLocationMappingDao);
			
		});
		return payerLocationMappingDaoList;
	}
}
