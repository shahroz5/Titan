package com.titan.poss.payment.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.CashbackDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CashbackSyncDtoExt extends CashbackSyncDto{
	
    public CashbackSyncDtoExt() {
		
	}
	
	public CashbackSyncDtoExt(CashbackDaoExt cashback) {
		MapperUtil.getObjectMapping(cashback, this);
		this.setPayerBankName(cashback.getPayerBankName().getBankName());
	}

}
