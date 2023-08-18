/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
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
public class CreditNoteEntitiesDto {

	private CustomerDao customer;

	@JsonIgnoreProperties("customer")
	private CustomerLocationMappingDao customerLocationMapping;

	@JsonIgnoreProperties({ "salesTxn", "linkedTxn", "parentCn", "originalCn", "mergedCN", "cancelTxn",
			"accountDetailsDao" })
	private CreditNoteDaoExt creditNote;

	@JsonIgnoreProperties("refTxnId")
	private SalesTxnDaoExt salesTxn;

	@JsonIgnoreProperties({ "salesTxnDao", "creditNoteDao" })
	private List<PaymentDetailsDaoExt> paymentDetails;

}
