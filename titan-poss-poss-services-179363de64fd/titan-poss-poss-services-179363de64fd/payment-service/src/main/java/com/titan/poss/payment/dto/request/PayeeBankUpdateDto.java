/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

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
public class PayeeBankUpdateDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = false)
	private String address;

	private String stateName;

	private String townName;

	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX, nullCheck = false)
	private String mailId;

	@PatternCheck(regexp = RegExConstants.NAME_REGEX, nullCheck = false)
	private String contactPerson;

	private String bankCode;

	private Boolean isActive;

	private String ownerType;

}
