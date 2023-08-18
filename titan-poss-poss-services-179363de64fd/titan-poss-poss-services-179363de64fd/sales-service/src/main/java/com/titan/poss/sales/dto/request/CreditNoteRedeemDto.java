/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import com.titan.poss.core.enums.CNType;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class CreditNoteRedeemDto extends CreditNoteRedeemBaseDto {

	// sales txn Id -- SalesTxnDao
	private SalesTxnDaoExt salesTxn; // parent txn

	private SalesTxnDaoExt linkedTxn; // latest txn // will have value when called from AB/ADV/CO/AcceptAdv. (if
										// coming then it
										// should have linked txn)

	// cancel transaction ID-- cancelDao
	private CancelDaoExt cancelTxn;

	private CNType creditNoteType;
	private String remarks;

	private FrozenRatesDetails frozenRatesDetails;

}
