/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.auth.dto.request;

import java.util.Date;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ClientErrorDto {

	@NotNull
	private String userName;

	@NotNull
	private String userAction;

	@NotNull
	private String locationCode;

	@NotNull
	private String moduleName;

	@NotNull
	private String errorMessage;

	@NotNull
	private Date timestamp;

	@NotNull
	private String errorLocator;





	@Override
	public String toString() {
		return "UserName: " + userName + ", UserAction: " + userAction + ", LocationCode: " + locationCode
				+ ", ModuleName: " + moduleName + ", ErrorMessage: " + errorMessage + ", Timestamp: " + timestamp
				+ ", ErrorLocator: " + errorLocator;
	}


}
