/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class StockIssueCancelDto extends IssueConfirmDto {

	@ValueOfEnum(enumClass = StockRequestStatusEnum.class)
	private String status;

}
