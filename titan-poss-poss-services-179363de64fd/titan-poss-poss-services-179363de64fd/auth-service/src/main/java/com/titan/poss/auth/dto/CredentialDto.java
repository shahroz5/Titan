/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CredentialDto {

	private String password;

	private String brandCode;

	private boolean isApiUserAllowed;

	public CredentialDto(String password, String brandCode) {
		super();
		this.password = password;
		this.brandCode = brandCode;
	}

	public CredentialDto(String password) {
		super();
		this.password = password;
	}

}
