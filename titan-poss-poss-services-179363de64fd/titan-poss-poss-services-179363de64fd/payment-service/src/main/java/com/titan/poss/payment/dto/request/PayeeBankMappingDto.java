/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto.request;

import java.util.List;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.payment.dto.AddPaymentCode;

import com.titan.poss.payment.dto.UpdateGLCodeDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class PayeeBankMappingDto {

	private List<AddPaymentCode> addPaymentCodes;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;

	private List<@PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String> removePaymentCodes;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> removeLocations;

	private List<UpdateGLCodeDto> updateConfigs;
}
