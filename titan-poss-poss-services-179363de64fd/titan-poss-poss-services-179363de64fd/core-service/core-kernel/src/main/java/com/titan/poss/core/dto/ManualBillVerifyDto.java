/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import java.util.Map;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Dto to verify Manual Bill.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class ManualBillVerifyDto extends ManualBillDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_50)
	private String password;
	
	@NotEmpty(message="Please provide metal rate details")
	private Map<@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX, nullCheck = true, message = "Please provide valid metal type code") String, @Valid MetalRateWithWeightDto> metalRates;

	private Boolean isFrozenRate;
	
	private Date frozenRateDate;
	 
}
