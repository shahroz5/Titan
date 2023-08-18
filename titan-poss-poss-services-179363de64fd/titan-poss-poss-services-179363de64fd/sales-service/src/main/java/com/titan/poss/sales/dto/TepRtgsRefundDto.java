/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TepRefundModeEnum;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TepRtgsRefundDto extends BaseFieldsValidator {

	@PatternCheck(regexp = RegExConstants.REFUND_NAME_REGEX, nullCheck = true)
	private String customerName;

	@NotNull(message = "bankAccountNo cannot be null")
	private String bankAccountNo;

	@NotNull(message = "bankName cannot be null")
	private String bankName;

	@NotNull(message = "branchName cannot be null")
	private String branchName;

	@NotNull(message = "ifscCode cannot be null")
	private String ifscCode;

	@NotNull(message = "refundMode cannot be null")
	@ValueOfEnum(enumClass = TepRefundModeEnum.class)
	private String refundMode;
}
