/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.AdvanceDao;
import com.titan.poss.sales.dao.SalesTxnDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AdvanceSyncDto extends SyncableEntity{

	private String id;
	
	private String frozenRateDetails;

	private BigDecimal finalValue;
	
	private String salesTxn;
	
	public AdvanceDao getAdvanceDao(AdvanceSyncDto advanceSyncDto) {
		AdvanceDao advanceDao=(AdvanceDao)MapperUtil.getObjectMapping(advanceSyncDto,new AdvanceDao());
		SalesTxnDao salesTDao=new SalesTxnDao();
		salesTDao.setId(advanceSyncDto.getSalesTxn());
		advanceDao.setSalesTxn(salesTDao);
		return advanceDao;
	}
}
