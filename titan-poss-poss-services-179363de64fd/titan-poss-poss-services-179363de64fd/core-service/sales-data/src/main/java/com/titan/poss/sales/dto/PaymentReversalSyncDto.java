/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.PaymentReversalDao;
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
public class PaymentReversalSyncDto extends SyncableEntity {
	

	private String creditNote;
	
	private String paymentCode;

	private String paymentGroup;

	private BigDecimal amount;

	private String hostName;

	private String instrumentType;

	private String instrumentNo;

	private String bankName;

	private String reference1;

	private Date reversalDate;// payment reversal date

	private String id;

	private String cancel;

	private String otherDetails;
	
	private String salesTxn;

	private String instrumentHash;
	
	private String paymentId;
	
	private Boolean isResidualRefund;

	private Integer paymentVoucherNo;
	
	public PaymentReversalSyncDto() {

	}

	public PaymentReversalSyncDto(PaymentReversalDao daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if (daoExt.getCancel() != null)
			this.setCancel(daoExt.getCancel().getId());
		if(daoExt.getSalesTxn()!=null)
			this.setSalesTxn(daoExt.getSalesTxn().getId());
		if(daoExt.getCreditNote() != null)
			this.setCreditNote(daoExt.getCreditNote().getId());
	}

	public PaymentReversalDao getPaymentReversalDao(PaymentReversalSyncDto syncDto) {
		PaymentReversalDao pmentReversalDao = (PaymentReversalDao) MapperUtil.getObjectMapping(syncDto,
				new PaymentReversalDao());
		if (syncDto.getCancel() != null) {
			CancelDao cnDao = new CancelDao();
			cnDao.setId(syncDto.getCancel());
			pmentReversalDao.setCancel(cnDao);
		}
		if(syncDto.getSalesTxn()!=null) {
			SalesTxnDao sales =new SalesTxnDao();
			sales.setId(syncDto.getSalesTxn());
			pmentReversalDao.setSalesTxn(sales);
		}
		
		if(syncDto.getCreditNote() != null) {
			CreditNoteDao credit = new CreditNoteDao();
			credit.setId(syncDto.getCreditNote());
			pmentReversalDao.setCreditNote(credit);
		}

		return pmentReversalDao;
	}

	public List<PaymentReversalDao> getPaymentReversalDaoList(List<PaymentReversalSyncDto> paymentReversalList) {
		List<PaymentReversalDao> daoList = new ArrayList<>();
		paymentReversalList.forEach(rev -> daoList.add(getPaymentReversalDao(rev)));
		return daoList;

	}

}
