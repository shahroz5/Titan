/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class RazorpayConfigDto {

	@JsonIgnore()
	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = true)
	private String locationCode;
	
	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_50, nullCheck = true)
	private String accountId;
	
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
