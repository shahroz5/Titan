/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.BankDepositDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BankDepositSyncDtoExt extends BankDepositSyncDto {
	public BankDepositSyncDtoExt() {

	}
	public BankDepositSyncDtoExt(BankDepositDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if(daoExt.getBankDepositSummaryDao()!=null)
			this.setBankDepositSummaryDao(daoExt.getBankDepositSummaryDao().getId());
		this.setBusinessDayDao(daoExt.getBusinessDayDao().getId());
	}
}
