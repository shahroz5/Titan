/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CashMemoDao;
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
public class CashMemoSyncDto extends SyncableEntity {

	private String salesTxnDao;

	private String id;

	private Short totalQuantity;

	private BigDecimal totalWeight;

	private BigDecimal totalValue;

	private BigDecimal totalDiscount;

	private BigDecimal totalTax;

	private String taxDetails;

	private BigDecimal finalValue;

	private BigDecimal paidValue;

	private String occasion;

	private String otherCharges;

	private String discountDetails;

	private BigDecimal roundingVariance;

	private Boolean isMigrated;

	private BigDecimal hallmarkCharges;

	private BigDecimal hallmarkDiscount;
	
	private BigDecimal tcsAmount;
	
	private Boolean legacyBillLevelDiscount;

	public CashMemoDao getCashMemoDao(CashMemoSyncDto cashMemoDto) {
		CashMemoDao cashMemoDao = (CashMemoDao) MapperUtil.getObjectMapping(cashMemoDto, new CashMemoDao());
		SalesTxnDao salesDaoParent = new SalesTxnDao();
		salesDaoParent.setId(cashMemoDto.getSalesTxnDao());
		cashMemoDao.setSalesTxnDao(salesDaoParent);
		return cashMemoDao;
	}

}
