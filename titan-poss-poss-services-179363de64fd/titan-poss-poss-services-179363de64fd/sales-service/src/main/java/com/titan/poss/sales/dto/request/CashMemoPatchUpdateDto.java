/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.OtherChargeDetailsDto;

import lombok.Data;

/**
 * DTO to update cash memo partially.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CashMemoPatchUpdateDto {

	private Integer customerId;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255 + "|^$")
	private String occasion;

	private OtherChargeDetailsDto otherChargeDetailsDto;

	// rso name - not for CM.
	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX)
	private String employeeCode;

	private JsonData discountTxnDetails;

	private BigDecimal tcsCollected; 
	
	private Boolean isIGST;
	
}
