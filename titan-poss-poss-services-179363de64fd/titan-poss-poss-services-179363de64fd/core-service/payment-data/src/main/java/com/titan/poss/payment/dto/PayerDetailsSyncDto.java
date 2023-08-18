/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PayerBankDao;
import com.titan.poss.payment.dao.PayerConfigDao;
import com.titan.poss.payment.dao.PayerDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class PayerDetailsSyncDto extends SyncableEntity{
	
	private String id;

	private String payerBank;

	private String payerBankConfig;
	
	public PayerDetailsDao getPayerDetailsDao(PayerDetailsSyncDto syncDto) {
		PayerDetailsDao deatilsDao=(PayerDetailsDao)MapperUtil.getObjectMapping(syncDto, new PayerDetailsDao());
		PayerBankDao payerBankDao=new PayerBankDao();
		payerBankDao.setBankName(syncDto.getPayerBank());
		deatilsDao.setPayerBank(payerBankDao);
		PayerConfigDao payerConfig=new PayerConfigDao();
		payerConfig.setId(syncDto.getPayerBankConfig());
		deatilsDao.setPayerBankConfig(payerConfig);
		return deatilsDao;
	}
	
	public List<PayerDetailsDao> getPayerDetailsList(List<PayerDetailsSyncDto> syncDtoList){
		List<PayerDetailsDao> payerList=new ArrayList<>();
		syncDtoList.forEach(syncDto->payerList.add(getPayerDetailsDao(syncDto)));
		return payerList;
	}
	
	
}
