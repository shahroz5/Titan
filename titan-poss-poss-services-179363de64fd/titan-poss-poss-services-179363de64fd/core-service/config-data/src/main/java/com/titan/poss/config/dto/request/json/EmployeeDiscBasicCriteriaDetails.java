/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import java.math.BigDecimal;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
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
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDiscBasicCriteriaDetails extends BaseFieldsValidator {

	private Boolean isNarationMandatory;

	@DecimalMin(value = "1.0", inclusive = true)
	@Digits(integer = 9, fraction = 0, message = "maxDiscount is not valid")
	private BigDecimal maxDiscount;

	private Boolean isTepRecovery;

	private Boolean isFullValueTepDiscountRecovery;

	@PatternCheck(regexp = RegExConstants.COMMA_SEPERATED_INTEGER_VALUES)
	private String startingSerialNo;

}
