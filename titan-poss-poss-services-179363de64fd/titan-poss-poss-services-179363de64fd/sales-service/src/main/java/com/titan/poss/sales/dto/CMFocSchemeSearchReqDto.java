/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import lombok.Data;

/**
 * DTO class for Foc Scheme Search Req filter
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CMFocSchemeSearchReqDto {

	private String cmStatus;

	private String focStatus;

	private String locationCode;

	private String transactionId;

}
