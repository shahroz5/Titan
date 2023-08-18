/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.inventory.dto.constants.StockReceiveStatusEnum;
import com.titan.poss.inventory.validator.ReceiveStockItemBulkDtoConstraint;

import lombok.Data;

/**
* @author Mindtree Ltd.
* @version 2.0
*/

@Data
@ReceiveStockItemBulkDtoConstraint
public class ReceiveStockItemBulkDto {

	@Size(max = 50)
	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> id = new ArrayList<>();

	@PatternCheck(regexp = RegExConstants.BIN_REGEX)
	private String binCode;

	@ValueOfEnum(enumClass = StockReceiveStatusEnum.class)
	private String status;

}
