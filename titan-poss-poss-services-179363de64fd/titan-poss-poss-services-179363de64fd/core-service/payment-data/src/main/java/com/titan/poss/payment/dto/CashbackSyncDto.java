/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.util.Date;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.CashbackDao;
import com.titan.poss.payment.dao.PayerBankDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CashbackSyncDto extends MasterSyncableEntity{
	
	private String cashbackName;

	private String payerBankName;

	private String cardNoLength;

	private Date startDate;

	private Date endDate;

	private Integer firstCardDigits;

	private Integer lastCardDigits;

	private Boolean mobileFlag;

	private Integer maxUsageCount;

	private String cmRemarks;

	private String offerRemarks;

	private Boolean excludeCashback;

	private Boolean isCashbackAmount;
	
	private String id;
	
	public CashbackDao getCashbackDao(CashbackSyncDto cashbackSyncDto) {
		CashbackDao cashbackDao=(CashbackDao)MapperUtil.getObjectMapping(cashbackSyncDto,new CashbackDao()); 
		PayerBankDao payerBankDao=new PayerBankDao();
		payerBankDao.setBankName(cashbackSyncDto.getPayerBankName());
		cashbackDao.setPayerBankName(payerBankDao);
		return cashbackDao; 
	}
	
}
