/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

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
public class ConversionRuleDetails extends BaseFieldsValidator {


	@PatternCheck(regexp = RegExConstants.DECIMAL_REGEX)
	String allowedLimitWeight;

	@PatternCheck(regexp = RegExConstants.RULE_FIELD_CODE_REGEX)
	String allowedLimitValue;

	@PatternCheck(regexp = RegExConstants.DECIMAL_REGEX)
	String autoApprovalLimitWeight;

	@PatternCheck(regexp = RegExConstants.RULE_FIELD_CODE_REGEX)
	String autoApprovalLimitValue;

}
