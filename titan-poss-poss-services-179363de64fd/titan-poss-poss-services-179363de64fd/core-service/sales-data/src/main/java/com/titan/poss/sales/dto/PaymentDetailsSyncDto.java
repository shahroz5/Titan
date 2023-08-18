/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;
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
public class PaymentDetailsSyncDto extends SyncableEntity {

	private Integer rowId;

	private String paymentCode;

	private String instrumentType;

	private String instrumentNo;

	private String bankName;

	private String bankBranch;

	private String reference1;

	private String reference2;

	private String reference3;

	private BigDecimal amount;

	private String remarks;

	private String status;

	private String currencyCode;

	private String otherDetails;

	private Date instrumentDate;

	private String hostName;

	private String paymentGroup;

	private String salesTxnType;

	private Date paymentDate;// business date of payment confirmation

	private Date reversalDate;

	private String id;

	private String salesTxnDao;

	private String creditNoteDao;

	private Boolean isEditable;

	private BigDecimal cashCollected;

	private Boolean isTcsPayment;

	private String instrumentHash;

	private Boolean isVoid;

	public PaymentDetailsDao getPaymentDetailsDao(PaymentDetailsSyncDto syncDto) {
		PaymentDetailsDao dao = (PaymentDetailsDao) MapperUtil.getObjectMapping(syncDto, new PaymentDetailsDao());
		SalesTxnDao salesDao = new SalesTxnDao();
		salesDao.setId(syncDto.getSalesTxnDao());
		if (syncDto.getCreditNoteDao() != null) {
			CreditNoteDao cn = new CreditNoteDao();
			cn.setId(syncDto.getCreditNoteDao());
			dao.setCreditNoteDao(cn);
		}
		dao.setSalesTxnDao(salesDao);
		return dao;
	}

	public List<PaymentDetailsDao> getPaymentDetailsDaoList(List<PaymentDetailsSyncDto> syncList) {
		List<PaymentDetailsDao> daoList = new ArrayList<>();
		syncList.forEach(sync -> daoList.add(getPaymentDetailsDao(sync)));
		return daoList;
	}
}
