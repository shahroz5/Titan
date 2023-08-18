/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.inventory.dto.constants.StockTransferStatusEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class StockTransferCancelDto {

	@NotNull(message = "status cannot be null")
	@ValueOfEnum(enumClass = StockTransferStatusEnum.class)
	private String status;

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX)
	private String remarks;

}
