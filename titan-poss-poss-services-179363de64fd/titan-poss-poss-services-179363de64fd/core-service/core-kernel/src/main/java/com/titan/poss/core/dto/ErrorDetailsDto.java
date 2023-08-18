/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ErrorDetailsDto {
	
	private String chequeNo;
	
	private String bankName;
	
	private String type;
	
	private String locationCode;
	
	private String collectionDate;
	
	

}
