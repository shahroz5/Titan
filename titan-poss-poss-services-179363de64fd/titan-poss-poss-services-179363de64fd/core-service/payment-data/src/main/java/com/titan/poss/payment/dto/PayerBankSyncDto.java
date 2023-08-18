/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
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
public class PayerBankSyncDto extends MasterSyncableEntity {

	private String bankName;

	private String correlationId;

	public PayerBankSyncDto() {

	}

	public PayerBankSyncDto(PayerBankDao payerBankDao) {
		MapperUtil.getObjectMapping(payerBankDao, this);
	}

	public PayerBankDao getPayerBankDao(PayerBankSyncDto payerBankSyncDto) {
		return (PayerBankDao) MapperUtil.getObjectMapping(payerBankSyncDto, new PayerBankDao());
	}

	public List<PayerBankDao> getPayerBankDaoList(List<PayerBankSyncDto> syncDtoList) {
		List<PayerBankDao> daoList = new ArrayList<>();
		for (PayerBankSyncDto payerBankSyncDto : syncDtoList) {
			PayerBankSyncDto syncDto = new PayerBankSyncDto();
			daoList.add(syncDto.getPayerBankDao(payerBankSyncDto));
		}
		return daoList;
	}

	public List<PayerBankSyncDto> getSyncDtoList(List<PayerBankDao> payerBankList) {
		List<PayerBankSyncDto> dtoList = new ArrayList<>();
		for (PayerBankDao payerBank : payerBankList) {
			PayerBankSyncDto syncDto = new PayerBankSyncDto(payerBank);
			dtoList.add(syncDto);
		}
		return dtoList;
	}
}
