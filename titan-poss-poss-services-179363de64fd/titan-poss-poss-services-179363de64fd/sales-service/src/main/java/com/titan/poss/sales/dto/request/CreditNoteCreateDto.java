/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.Date;
import java.util.List;

import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditNoteCreateDto {

	// Global fields RefTxnType, parentTxn, status, customerId
	private Integer customerId;
	// sales txn Id -- SalesTxnDao
	private SalesTxnDaoExt salesTxn;

	// cancel transaction ID-- cancelDao in case of bill cancellation use this feild
	private CancelDaoExt cancelTxn;

	// CN specific fields go here
	private List<CreditNoteIndvCreateDto> cNIndividual;

	private Boolean isLinkTxn;

	private Date docDate;// for EOD purpose

	private SalesTxnDaoExt linkedTxnDao;// to link the child CN to linked txn, on partial redemption for parent CN

	private Boolean isRedemption;
	
	private Integer refDocNo;
	
	private String refDocType;
	
	private Short refFiscalYear;

}
