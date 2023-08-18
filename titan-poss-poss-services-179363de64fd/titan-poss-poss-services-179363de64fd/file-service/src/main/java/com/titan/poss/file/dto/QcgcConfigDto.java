/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

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
public class QcgcConfigDto {

	@JsonIgnore()
	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = true)
	private String locationCode;

	@JsonProperty("TerminalId")
	@PatternCheck(regexp = RegExConstants.QCGC_TERMINAL_ID_REGEX, nullCheck = true)
	private String terminalId;
	
	@JsonIgnore()
	private String configDetails;

	@JsonIgnore()
	private Boolean isActive;

	@JsonIgnore()
	private String fileId;
	
	@JsonIgnore()
	private String createdBy;

	@JsonIgnore()
	private Date createdDate;
	
	@JsonIgnore()
	private String lastModifiedBy;

	@JsonIgnore()
	private Date lastModifiedDate;
	
	
}
