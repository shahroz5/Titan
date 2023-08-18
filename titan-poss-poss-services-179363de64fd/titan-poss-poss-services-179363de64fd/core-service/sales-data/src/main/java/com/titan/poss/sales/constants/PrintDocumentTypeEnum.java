/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.constants;

import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum PrintDocumentTypeEnum {

	CM, AB, ACCEPT_ADVANCE, GC, GEP, GEP_CANCEL, TEP_CANCEL, GRN, TEP, DEPOSIT, GRF, MERGE_GRF, COA, CM_ANNEXURE,
	TEP_REFUND, TEP_ANNEXURE,BILL_CANCELLATION,GC_WITH_CN,GC_WITH_RETURN,CM_CANCELLATION,TEP_DIGITAL_SIGNATURE,GEP_DIGITAL_SIGNATURE,
	CREDIT_NOTE, CREDIT_NOTE_CANCELLATION, CO;

	public static List<String> getCancelDocTypes() {

		return List.of(GEP_CANCEL.name(), TEP_CANCEL.name(), GRN.name(),BILL_CANCELLATION.name(),GC_WITH_CN.name(),CM_CANCELLATION.name(),CM_CANCELLATION.name());
	}
}
