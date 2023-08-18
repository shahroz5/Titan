/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dto.request;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.FieldDetailDto;
import com.titan.poss.payment.constants.PaymentConstants;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PaymentAddDto{

	@PatternCheck(message = PaymentConstants.INVALID_PAYMENT_CODE, regexp = RegExConstants.PAYMENT_CODE_REGEX, nullCheck = true)
	private String paymentCode;

	@PatternCheck(message = PaymentConstants.INVALID_DESCRIPTION, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String description;

	private List<FieldDetailDto> fieldDetails;

	@NotNull
	private Boolean isActive;
	
	@NotNull
	private Boolean customerDependent;
	
}
