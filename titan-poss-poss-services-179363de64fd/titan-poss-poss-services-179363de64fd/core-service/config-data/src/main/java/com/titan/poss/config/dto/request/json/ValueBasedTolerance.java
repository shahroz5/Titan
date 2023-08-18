/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request.json;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.constraints.Digits;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ValueBasedTolerance implements Serializable {

	private static final long serialVersionUID = 1L;

	private Integer rowId;

	@Digits(integer = 6, fraction = 2, message = "fromRange valid till 2 decimal places only")
	private BigDecimal fromRange;

	@Digits(integer = 6, fraction = 2, message = "toRange valid till 2 decimal places only")
	private BigDecimal toRange;

	@Digits(integer = 6, fraction = 3, message = "fromRange valid till 3 decimal places only")
	private BigDecimal tolerancePercent;

}
