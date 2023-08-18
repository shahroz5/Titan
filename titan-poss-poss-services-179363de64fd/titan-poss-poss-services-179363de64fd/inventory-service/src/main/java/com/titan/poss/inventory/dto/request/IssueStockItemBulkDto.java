/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;


import java.util.List;

import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;

import lombok.Data;


/**
* @author Mindtree Ltd.
* @version 2.0
*/

/**
 * Class for the creating list of stock transfer for isssuing.
 * 
 */
@Data
public class IssueStockItemBulkDto {

	@Size(max = 50)
	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> itemIds;

	@ValueOfEnum(enumClass = StockRequestStatusEnum.class)
	private String status;

}