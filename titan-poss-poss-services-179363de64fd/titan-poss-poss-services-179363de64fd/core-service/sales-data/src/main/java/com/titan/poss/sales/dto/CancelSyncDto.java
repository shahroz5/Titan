/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CancelDao;
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
public class CancelSyncDto extends SyncableEntity {

	private String status;

	private String locationCode;

	private BigDecimal totalValue;

	private String cancellationType;

	private String remarks;

	private String reasonForCancellation;

	private String employeeCode;

	private Date cancelledTime;

	private Short prints;

	private BigDecimal totalWeight;

	private Short totalQuantity;

	private String txnType;

	private String subTxnType;

	private Integer customerId;

	private Integer docNo;

	private Short fiscalYear;

	private Date docDate;

	private String cancellationDetails;

	private String currencyCode;

	private String weightUnit;
	
	private String id;

	private String refSalesTxn;

	public CancelDao getCancelDao(CancelSyncDto syncDto) {
		CancelDao canclDao = (CancelDao) MapperUtil.getObjectMapping(syncDto, new CancelDao());
		SalesTxnDao salesTxn = new SalesTxnDao();
		salesTxn.setId(syncDto.getRefSalesTxn());
		canclDao.setRefSalesTxn(salesTxn);
		return canclDao;
	}
}
