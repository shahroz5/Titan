/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigInteger;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GVStatusDto {

	private BigInteger serialNo;
	private String itemcode;
	private String result;
	private String message;
	private String timestamp;
	
	//success or failure

}
