/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class NcMemberDataStageDto {

    private String channel;
    
    private String storeCode;

	@PatternCheck(regexp = RegExConstants.ULP_ID_REGEX, nullCheck = true)
	private String unifiedLoyaltyNo;

	@JsonFormat(pattern = "dd-MM-yyyy")
	private String transactionDate;

    private String oldLoyaltyNo;

    private String oldLoyaltyType;

	@PatternCheck(regexp = RegExConstants.NAME_REGEX, nullCheck = true)
	private String firstName;

    private String lastName;

	@PatternCheck(regexp = RegExConstants.MOBILE_REGEX, nullCheck = false)
	private String mobileNo;
    
	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX, nullCheck = false)
	private String email;
	
}
