/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
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
public class SalesTxnSyncDto extends SyncableEntity {

	private String id;

	private String refTxnId;

	private String txnType;

	private String locationCode;

	private Integer docNo;

	private Short fiscalYear;

	private String employeeCode;

	private String status;

	private Integer customerId;

	private String metalRateDetails;

	private Date firstHoldTime;

	private Date lastHoldTime;

	private String refTxnType;

	private Date docDate;

	private String subTxnType;

	private String manualBillDetails;

	private String remarks;

	private Date confirmedTime;

	private Integer prints;

	private String printDetails;

	private Date lastInvokeTime;

	private String manualBillId;

	private String currencyCode;

	private String weightUnit;

	private String customerDocDetails;

	private String requestType;

	private String previousStatus;

	private Date requestedDate;

	private Date invokeTime;

	private Integer invokeCount;

	private String discountTxnDetails;

	private String refSubTxnType;

	private String focRemarks;

	private Integer emailPrints;

	private Date manualFocDate;

	private Integer isManualFoc;

	private String txnSource;

	private String cashMemoPullReason;

	public SalesTxnDao getSalesDao(SalesTxnSyncDto salesTxnSyncDto) {
		SalesTxnDao salesDao = (SalesTxnDao) MapperUtil.getObjectMapping(salesTxnSyncDto, new SalesTxnDao());
		if (salesTxnSyncDto.getRefTxnId() != null) {
			SalesTxnDao salesDaoParent = new SalesTxnDao();
			salesDaoParent.setId(salesTxnSyncDto.getRefTxnId());
			salesDao.setRefTxnId(salesDaoParent);
		}
		return salesDao;
	}

	public List<SalesTxnDao> getSalesDaoList(List<SalesTxnSyncDto> salesTxnSyncDtoList) {
		return salesTxnSyncDtoList.stream().map(sycTxn -> sycTxn.getSalesDao(sycTxn)).collect(Collectors.toList());
	}
}
