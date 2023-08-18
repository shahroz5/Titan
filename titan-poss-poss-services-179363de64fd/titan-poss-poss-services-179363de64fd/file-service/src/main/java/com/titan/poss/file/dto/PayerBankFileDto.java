/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class PayerBankFileDto {

	@JsonProperty("bankName")
	private String bankName;

	@JsonProperty("isActive")
	private String isActive;
}
