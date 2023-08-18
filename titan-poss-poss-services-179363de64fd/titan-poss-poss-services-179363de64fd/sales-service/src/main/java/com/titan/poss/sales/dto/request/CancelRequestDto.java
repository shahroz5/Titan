/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import javax.validation.constraints.NotBlank;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to request cancel.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelRequestDto {

	@NotBlank(message = "reason for cancellation cannot be null or empty")
	private String reasonForCancellation;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String remarks;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String refTxnId;

	// employeeCode removed as per UAT_550

}
