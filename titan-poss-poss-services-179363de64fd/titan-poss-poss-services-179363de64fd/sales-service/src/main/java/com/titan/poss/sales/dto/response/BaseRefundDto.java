/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class BaseRefundDto {

	private String id;
	private String refundType;
	private String status;
	private String locationCode;
	private String refTxnId;
}
