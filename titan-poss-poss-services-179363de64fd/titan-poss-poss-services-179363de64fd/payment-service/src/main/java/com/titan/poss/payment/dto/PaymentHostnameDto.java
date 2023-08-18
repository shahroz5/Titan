/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class PaymentHostnameDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String id;

	@PatternCheck(regexp = RegExConstants.DEVICE_ID_REGEX)
	private String deviceId;

	@NotNull(message = "is active cannot be null")
	private Boolean isActive;
}
