package com.titan.poss.sales.dto;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.BankDepositSummaryDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BankDepositSummarySyncDto extends SyncableEntity{

	private String id;
	
	private String denominationDetails;
	
	public BankDepositSummaryDao getBankingDepositSummary(BankDepositSummarySyncDto syncDto) {
		return (BankDepositSummaryDao)MapperUtil.getObjectMapping(syncDto,new BankDepositSummaryDao());
	}
}
