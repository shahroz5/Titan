/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class AddRangeDto {

	@NotNull(message = "row id should not be null")
	@Positive(message = "row id should be positive")
	private Integer rowId;

//	@Digits(fraction = 3, integer = 18, message = "from range is valid till {integer} integral digits {fraction} decimal places only")
	@NotNull(message = "from range should not be null")
	@PositiveOrZero(message = "from range should be 0 or more than 0")
	private BigDecimal fromRange;

//	@Digits(fraction = 3, integer = 18, message = "to range is valid till {integer} integral digits {fraction} decimal places only")
	@NotNull(message = "to range should not be null")
	@PositiveOrZero(message = "to range should be 0 or more than 0")
	private BigDecimal toRange;

	@NotNull(message = "is active cannot be null")
	private Boolean isActive;

}
