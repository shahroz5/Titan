/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.ConfigTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
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
public class ConfigRequestDto {

	@NotNull
	@NotBlank
	@Size(min = 1, max = 100)
	@PatternCheck(message = PaymentConstants.INVALID_DESCRIPTION, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String description;

	@NotNull
	@ValueOfEnum(enumClass = ConfigTypeEnum.class)
	private String configType;

	private Boolean isActive;
}
