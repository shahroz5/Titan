/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */


package com.titan.poss.integration.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CustomerOrderVendorDetailsDto {

	private String username;
	
	private String password;
	
	private String fetchComOrders;
	
	private String updateStatus;
	
	private String fetchComOrdersMajor;
	
	private String confirmComOrder;
	
	private String orderStatusCM;
}
