/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.FocDetailsDao;
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
public class FocDetailsSyncDto extends SyncableEntity {

	private String itemCode;

	private String lotNumber;

	private Short rowId;

	private BigDecimal unitWeight;

	private Short totalQuantity;

	private BigDecimal totalWeight;

	private String inventoryId;

	private String binCode;

	private String employeeCode;

	private String status;

	private String id;

	private String salesTxn;

	private String focScheme;

	private BigDecimal totalValue;

	private String inventoryDetails;

	public FocDetailsDao getFocDetailsDao(FocDetailsSyncDto syncDto) {
		FocDetailsDao focDao = (FocDetailsDao) MapperUtil.getObjectMapping(syncDto, new FocDetailsDao());
		SalesTxnDao txnDao = new SalesTxnDao();
		txnDao.setId(syncDto.getSalesTxn());
		FocSchemesDao schemeDao = new FocSchemesDao();
		schemeDao.setId(syncDto.getFocScheme());
		focDao.setSalesTxn(txnDao);
		focDao.setFocScheme(schemeDao);
		return focDao;
	}

	public List<FocDetailsDao> getFocDetailsDaoList(List<FocDetailsSyncDto> syncDtoList) {
		List<FocDetailsDao> focDetailsList = new ArrayList<>();
		syncDtoList.forEach(dto -> focDetailsList.add(getFocDetailsDao(dto)));
		return focDetailsList;
	}
}
