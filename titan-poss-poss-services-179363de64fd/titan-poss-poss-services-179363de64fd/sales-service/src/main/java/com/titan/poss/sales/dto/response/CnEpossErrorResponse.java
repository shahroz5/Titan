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
public class CnEpossErrorResponse {
	
	private Integer docNo;
	
	private String locationCode;
	
	private Short fiscalYear;

}
