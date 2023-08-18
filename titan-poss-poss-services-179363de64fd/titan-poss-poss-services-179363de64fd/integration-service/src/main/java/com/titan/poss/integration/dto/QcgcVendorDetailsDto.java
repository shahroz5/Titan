/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class QcgcVendorDetailsDto extends BaseFieldsValidator{

	@JsonProperty("UserName")
	private String userName;
	
	@JsonProperty("Password")
	private String password;
	
	@JsonProperty("ForwardingEntityId")
	private String forwardingEntityId;
	
	@JsonProperty("ForwardingEntityPassword")
	private String forwardingEntityPassword;
	
	@JsonProperty("Host")
	private String host;
	
	@JsonProperty("IsForwardingEntityExists")
	private String isForwardingEntityExists;
	
	@JsonProperty("POSEntrymode")
	private String posEntrymode;
	
	@JsonProperty("POSTypeId")
	private String posTypeId;
	
}
