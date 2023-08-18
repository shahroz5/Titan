/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.sales.constants.CancellationTypeEnum;

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
//@RemarksCheckForBillCancelWORequest
public class ConfirmCancelDto extends CancelRequestDto {

	@ValueOfEnum(enumClass = CancellationTypeEnum.class)
	private String cancelType;

}
