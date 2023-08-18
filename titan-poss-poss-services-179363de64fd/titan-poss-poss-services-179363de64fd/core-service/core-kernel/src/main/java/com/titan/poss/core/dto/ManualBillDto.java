/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Positive;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Manual Bill
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManualBillDto {

	@NotNull(message = "Please provide manual bill date")
	@PastOrPresent
	@DateTimeFormat(iso = ISO.DATE)
	private Date manualBillDate;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20, nullCheck = true)
	private String manualBillNo;

	@Positive(message = "Manual bill value must be positive")
	@Digits(integer = 10, fraction = 0, message = "Manual bill value valid till {integer} integral digits and {fraction} decimal places only")
	private BigDecimal manualBillValue;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255, nullCheck = true)
	private String remarks;

	@PatternCheck(regexp = RegExConstants.EMPCODE_OR_NAME, nullCheck = true, message = "approved by must not be null")
	private String approvedBy;
	
	private Boolean isBimetal;
}
