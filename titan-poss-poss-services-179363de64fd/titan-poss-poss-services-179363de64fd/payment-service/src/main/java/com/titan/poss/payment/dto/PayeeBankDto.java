/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.payment.constants.PaymentConstants;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PayeeBankDto {

	@Size(min = 1, max = 50, message = "Bank Name min length {min} and max length is {max}")
	@PatternCheck(message = PaymentConstants.INVALID_BANK_NAME, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String bankName;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = false)
	private String address;

	private String stateName;

	private String townName;

	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX, nullCheck = false)
	private String mailId;

	@PatternCheck(regexp = RegExConstants.NAME_REGEX, nullCheck = false)
	private String contactPerson;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String bankCode;

	@NotNull
	private Boolean isActive;

	private String ownerType;

}
