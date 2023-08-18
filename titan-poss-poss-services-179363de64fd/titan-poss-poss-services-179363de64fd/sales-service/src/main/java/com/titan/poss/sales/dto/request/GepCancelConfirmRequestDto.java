/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.sales.constants.CancellationTypeEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class GepCancelConfirmRequestDto {

	@NotBlank(message = "reason for cancellation cannot be null or empty")
	private String reasonForCancellation;

	@Size(min = 1, max = 255)
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255, nullCheck = true)
	private String remarks;

	@NotBlank(message = "cancel type cannot be null or empty")
	@ValueOfEnum(enumClass = CancellationTypeEnum.class)
	private String cancelType;
}
