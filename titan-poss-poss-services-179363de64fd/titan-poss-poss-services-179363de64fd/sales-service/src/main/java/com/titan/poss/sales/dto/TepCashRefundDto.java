/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.TepRefundModeEnum;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
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
public class TepCashRefundDto extends BaseFieldsValidator {

	@NotNull(message = "refundMode cannot be null")
	@ValueOfEnum(enumClass = TepRefundModeEnum.class)
	private String refundMode;
}
