/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.BankDepositSummaryDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BankDepositSummarySyncDtoExt extends BankDepositSummarySyncDto{

	public BankDepositSummarySyncDtoExt(){
		
	}
	
	public BankDepositSummarySyncDtoExt(BankDepositSummaryDaoExt daoExt){
		MapperUtil.getObjectMapping(daoExt, this);
	}
	
	
}
