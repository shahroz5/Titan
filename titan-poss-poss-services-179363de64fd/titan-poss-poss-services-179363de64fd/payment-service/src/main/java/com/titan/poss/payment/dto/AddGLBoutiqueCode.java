/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

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
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class AddGLBoutiqueCode {

	private String glCode;

	@PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX)
	private String paymentCode;
}
