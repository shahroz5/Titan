/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * Request DTO class for Common Sales Txn attributes across the Module
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class BaseSalesTxnRequestDto {

	@NotNull(message = "Please provide customerId")
	private Integer customerId;

	@Size(max = 255, message = "Remarks max length is {max}")
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String remarks;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String focRemarks;

}
