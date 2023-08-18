/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.constants;

import java.util.List;

/**
 * ENUM class for Sales service related doc types
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum SalesDocTypeEnum {

	// add a doc master record with docNo as '0' for every new docType
	CM_OPEN, CM_HOLD, CM_PENDING, CM, GEP_OPEN, GEP_HOLD, GEP, CMCAN, CN, CN_IBT, CNCAN, ADV_OPEN, ADV, GEPCAN, AB_OPEN,
	AB_HOLD, AB_MB_REQ, AB, GRN, TEP_OPEN, TEP_HOLD, TEP, TEPCAN, CT_DELETE, CUT_PIECE_OPEN, CUT_PIECE, GRF_OPEN,
	GRF_PENDING, CO_OPEN, CO_HOLD, CO_MB_REQ, CO, PAYMENT_VOUCHER,DEBIT_NOTE;

	public static List<SalesDocTypeEnum> getDocTypesForAudit() {
		return List.of(CM,AB,CO,GEP,TEP,CMCAN,TEPCAN,GEPCAN,ADV,GRN);
	}

}