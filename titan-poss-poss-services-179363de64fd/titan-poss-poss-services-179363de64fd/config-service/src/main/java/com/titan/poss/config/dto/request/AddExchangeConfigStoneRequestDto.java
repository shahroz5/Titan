/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.config.dto.BaseExchangeConfigStoneDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AddExchangeConfigStoneRequestDto extends BaseExchangeConfigStoneDto {

	@NotNull(message = "rowId should not be null")
	@Positive(message = "rowId should be more than 0")
	private Integer rowId;
}
