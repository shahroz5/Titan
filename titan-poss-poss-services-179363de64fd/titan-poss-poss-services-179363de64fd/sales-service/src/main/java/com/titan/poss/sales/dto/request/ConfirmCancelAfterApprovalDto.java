/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.sales.constants.CancellationTypeEnum;

import lombok.Data;

/**
 * DTO to confirm cancel after approval of request.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ConfirmCancelAfterApprovalDto {

	@ValueOfEnum(enumClass = CancellationTypeEnum.class)
	private String cancelType;

	@Size(min = 1, max = 255)
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255, nullCheck = false)
	private String remarks;
}
