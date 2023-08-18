/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.FocSchemesDao;
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
public class FocSchemeSyncDto extends SyncableEntity {

	private String purchaseItems;

	private String eligibleFocItems;

	private BigDecimal eligibleWeight;

	private Short eligibleQuantity;

	private String status;

	private String schemeDetails;

	private String id;

	private String salesTxn;

	private String headerConfigDetails;

	private String rowConfigDetails;

	private String productGroupDetails;

	private String focItemDetails;
	
	private String manualFocItemDetails;

	public FocSchemesDao getFocSchemesDao(FocSchemeSyncDto syncDto) {
		FocSchemesDao focDao = (FocSchemesDao) MapperUtil.getObjectMapping(syncDto, new FocSchemesDao());
		SalesTxnDao txnDao = new SalesTxnDao();
		txnDao.setId(syncDto.getSalesTxn());
		focDao.setSalesTxn(txnDao);
		return focDao;
	}

	public List<FocSchemesDao> getFocSchemesList(List<FocSchemeSyncDto> syncDtoList) {
		List<FocSchemesDao> focDaoList = new ArrayList<>();
		syncDtoList.forEach(dto -> focDaoList.add(getFocSchemesDao(dto)));
		return focDaoList;
	}
}
