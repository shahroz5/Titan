/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AirpayConfigDto {

	@JsonIgnore()
	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = true)
	private String locationCode;

	@JsonProperty("MerchantId")
	@PatternCheck(regexp = RegExConstants.AIRPAY_MERCHANT_ID_REGEX, nullCheck = true)
	private String merchantId;

	@JsonProperty("Username")
	@PatternCheck(regexp = RegExConstants.AIRPAY_USERNAME_REGEX, nullCheck = true)
	private String username;

	@JsonProperty("Password")
	@PatternCheck(regexp = RegExConstants.AIRPAY_PASS_WORD_REGEX, nullCheck = true)
	private String password;

	@JsonProperty("SecretKey")
	@PatternCheck(regexp = RegExConstants.AIRPAY_SECRET_KEY_REGEX, nullCheck = true)
	private String secretKey;

	@JsonProperty("SecretToken")
	@PatternCheck(regexp = RegExConstants.AIRPAY_SECRET_TOKEN_REGEX, nullCheck = true)
	private String secretToken;

	@JsonIgnore()
	private String configDetails;

	@JsonIgnore()
	private Boolean isActive;

	@JsonIgnore()
	private String fileAuditId;
	
	@JsonIgnore()
	private String createdBy;

	@JsonIgnore()
	private Date createdDate;
	
	@JsonIgnore()
	private String lastModifiedBy;

	@JsonIgnore()
	private Date lastModifiedDate;
	
	
}
