/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;

import lombok.Data;

/**
 * DTO class for updating an stock request item
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StockRequestItemUpdateDto {

	@PositiveOrZero
	private Short quantity;

	@NotNull
	@ValueOfEnum(enumClass = StockRequestStatusEnum.class)
	private String status;

}
