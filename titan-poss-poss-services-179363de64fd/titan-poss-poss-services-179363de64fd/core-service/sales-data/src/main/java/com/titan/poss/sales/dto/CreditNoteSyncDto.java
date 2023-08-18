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
import com.titan.poss.sales.dao.AccountDetailsDao;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.GepConfigDetailsDao;
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
public class CreditNoteSyncDto extends SyncableEntity {

	private String creditNoteType;

	private String locationCode;

	private Short fiscalYear;

	private Integer docNo;

	private Date docDate;

	private Integer customerId;

	private BigDecimal amount;

	private BigDecimal utilisedAmount;

	private String paymentDetails;

	private String eghsDetails;

	private String frozenRateDetails;

	private String gepDetails;

	private String activationDetails;

	private BigDecimal totalTax;

	private String taxDetails;

	private String tepDetails;

	private String grnDetails;

	private String processId;

	private String remarks;

	private String status;

	private String workflowStatus;

	private String cancelRemarks;

	private Integer prints;

	private BigDecimal cashCollected;

	private String cnTransferId;

	private String id;

	private String salesTxn;

	private String linkedTxn;

	private String parentCn;

	private String originalCn;

	private String cancelTxn;

	private String mergedCN;

	private String accountDetailsDao;

	private String gepConfigDetailsDao;

	private String publishStatus;

	private Boolean isTransferEghsAllowed;

	private Date originalDocDate;

	private Date redeemDate;

	private String discountDetails;

	private String txnSource;
	
	private String ibtLocation;
	
	private Integer refDocNo;
	
	private String refDocType;
	
	private Short refFiscalYear;

	private Date cancelDate;

	private BigDecimal refundValue;

	private String grnFocDetails;
	
	private Boolean isUnipay;
	
	private BigDecimal refundDeduction;
	
	private Integer debitNoteDocNo;
	
	private Integer debitNoteFiscalYear;

	public CreditNoteSyncDto() {

	}

	public CreditNoteDao getCreditNoteDao(CreditNoteSyncDto synDto) {
		CreditNoteDao creditDao = (CreditNoteDao) MapperUtil.getObjectMapping(synDto, new CreditNoteDao());
		if (synDto.getSalesTxn() != null) {
			SalesTxnDao salesTxnDao = new SalesTxnDao();
			salesTxnDao.setId(synDto.getSalesTxn());
			creditDao.setSalesTxn(salesTxnDao);
		}
		if (synDto.getLinkedTxn() != null) {
			SalesTxnDao linkedTxnDao = new SalesTxnDao();
			linkedTxnDao.setId(synDto.getLinkedTxn());
			creditDao.setLinkedTxn(linkedTxnDao);
		}
		if (synDto.getParentCn() != null) {
			CreditNoteDao parentCnDao = new CreditNoteDao();
			parentCnDao.setId(synDto.getParentCn());
			creditDao.setParentCn(parentCnDao);
		}
		if (synDto.getOriginalCn() != null) {
			CreditNoteDao originalCnDao = new CreditNoteDao();
			originalCnDao.setId(synDto.getOriginalCn());
			creditDao.setOriginalCn(originalCnDao);
		}
		if (synDto.getCancelTxn() != null) {
			CancelDao cancelTxnDao = new CancelDao();
			cancelTxnDao.setId(synDto.getCancelTxn());
			creditDao.setCancelTxn(cancelTxnDao);
		}
		if (synDto.getAccountDetailsDao() != null) {
			AccountDetailsDao accountDetails = new AccountDetailsDao();
			accountDetails.setId(synDto.getAccountDetailsDao());
			creditDao.setAccountDetailsDao(accountDetails);
		}
		if (synDto.getMergedCN() != null) {
			CreditNoteDao mergedCnDao = new CreditNoteDao();
			mergedCnDao.setId(synDto.getMergedCN());
			creditDao.setMergedCN(mergedCnDao);
		}
		if (synDto.getGepConfigDetailsDao() != null) {
			GepConfigDetailsDao gepConfigDetails = new GepConfigDetailsDao();
			gepConfigDetails.setId(synDto.getGepConfigDetailsDao());
			creditDao.setGepConfigDetailsDao(gepConfigDetails);
		}

		return creditDao;
	}

	public List<CreditNoteDao> getCreditNoteDaoList(List<CreditNoteSyncDto> syncDtoList) {
		List<CreditNoteDao> daoList = new ArrayList<>();
		syncDtoList.forEach(sync -> daoList.add(getCreditNoteDao(sync)));
		return daoList;

	}

	public CreditNoteSyncDto(CreditNoteDao creditDao) {
		MapperUtil.getObjectMapping(creditDao, this);
		if (creditDao.getSalesTxn() != null)
			this.setSalesTxn(creditDao.getSalesTxn().getId());
		if (creditDao.getParentCn() != null)
			this.setParentCn(creditDao.getParentCn().getId());
		if (creditDao.getOriginalCn() != null)
			this.setOriginalCn(creditDao.getOriginalCn().getId());
		if (creditDao.getLinkedTxn() != null)
			this.setLinkedTxn(creditDao.getLinkedTxn().getId());
		if (creditDao.getCancelTxn() != null)
			this.setCancelTxn(creditDao.getCancelTxn().getId());
		if (creditDao.getMergedCN() != null)
			this.setMergedCN(creditDao.getMergedCN().getId());
	}
}
