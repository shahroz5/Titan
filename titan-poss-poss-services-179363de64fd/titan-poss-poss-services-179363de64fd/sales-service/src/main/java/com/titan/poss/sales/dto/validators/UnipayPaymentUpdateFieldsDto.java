/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.validators;

import java.util.Date;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Dto for validating Unipay payment fields in update.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class UnipayPaymentUpdateFieldsDto extends BasePaymentFieldsDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = "Please provide valid bank name", nullCheck = true)
	private String bankName;

	@NotNull(message = "Please provide instrument number")
	private String instrumentNo;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true, message = "Please provide instrument type")
	private String instrumentType;

	@NotNull(message = "Please provide instrument date")
	private Date instrumentDate;

}
