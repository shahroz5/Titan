/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.GrnApprovalProcessTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GrnApprovalAccessConfigDto {

	@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = true)
	private String roleCode;

	@ValueOfEnum(enumClass = GrnApprovalProcessTypeEnum.class, nullCheck = true)
	private String processType;

	@NotNull
	private Short fromDays;

	@NotNull
	private Short tillDays;

	@Digits(integer = DomainConstants.MAX_NO_OF_DIGIT, fraction = DomainConstants.PRICE_SCALE)
	private BigDecimal upperLimit;

}
