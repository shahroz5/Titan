/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class RivaahCardCouponDetails extends BaseFieldsValidator {

	private String noOfDigits;

	private String startingDigits;

	private String validityNoOfMonths;

	private Integer NoOfTimesCouponCanBeUsed;

}
