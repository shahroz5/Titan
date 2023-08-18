/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class UserSessionDetailsBaseDto {

	private String userName;

	private String employeeCode;

	private String employeeName;

	private String emailId;

	private String mobileNo;

}
