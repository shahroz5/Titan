/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

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
@EqualsAndHashCode(callSuper = false)
public class CardDetailDto implements Serializable {

	private static final long serialVersionUID = 1L;

	@PatternCheck(message = "CardNumber should be Numbers within 20 digits only", regexp = RegExConstants.NUMERIC_REGEX)
	private String cardNo;

	@NotNull
	private Boolean isActive;

}
