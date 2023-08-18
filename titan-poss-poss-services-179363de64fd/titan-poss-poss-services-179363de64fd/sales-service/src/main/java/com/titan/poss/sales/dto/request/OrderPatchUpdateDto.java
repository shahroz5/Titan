/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.MetalRateListDto;

import lombok.Data;

/**
 * Request DTO class for Partial Update of Order
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class OrderPatchUpdateDto {

	private Integer customerId;

	// rso name
	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX)
	private String employeeCode;

	private Boolean isFrozenRate;

	private Boolean isBestRate;

	@Valid
	private MetalRateListDto metalRateList;

	@PositiveOrZero(message = "Paid Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Paid value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal paidValue;

	// Mandatory in case of cancellation
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String remarks;

	private JsonData discountTxnDetails;
	
	private JsonData nomineeDetails;
	
	private String collectedBy;
	
	private BigDecimal totalEaValue;
}
