/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.constants;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum UploadFileDocTypeEnum {

	CM(true, true), GEP(true, true), AB(true, true), CO(true, true), ADV(true, true), GRF(true, true), TEP(true, true),
	CUSTOMER_WORKFLOW(false, false), CUSTOMER(false, false), GRN(false, true), MERGE_GRF(false, true),
	CN_WORKFLOW(false, true),CN_REDEMPTION(true,true), GHS_REDEMPTION(true, true);

	private boolean isTxnIdRequiredForUpload;
	private boolean isTxnIdRequiredForList;

	private UploadFileDocTypeEnum(boolean isTxnIdRequiredForUpload, boolean isTxnIdRequiredForList) {
		this.isTxnIdRequiredForUpload = isTxnIdRequiredForUpload;
		this.isTxnIdRequiredForList = isTxnIdRequiredForList;
	}

	public boolean isTxnIdRequiredForUpload() {
		return isTxnIdRequiredForUpload;
	}

	public boolean isTxnIdRequiredForList() {
		return isTxnIdRequiredForList;
	}

}
