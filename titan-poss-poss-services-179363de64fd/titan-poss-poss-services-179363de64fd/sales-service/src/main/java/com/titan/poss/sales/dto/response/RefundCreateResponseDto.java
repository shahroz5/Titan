/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RefundCreateResponseDto {

	private String locationCode;
	private String status;
	private JsonData requestData;
	private String txnType;
	private String refTxnId;
	private String refundType;
	private String id;
	private String subTxnType;
	private String employeeCode;
}
