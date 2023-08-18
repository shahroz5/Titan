/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request.json;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.constraints.Digits;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class WeightBasedTolerance implements Serializable {

	private static final long serialVersionUID = 1L;

	private Integer rowId;

	@Digits(integer = 6, fraction = 3, message = "fromRange valid till 3 decimal places only")
	private BigDecimal fromRange;

	@Digits(integer = 6, fraction = 3, message = "toRange valid till 3 decimal places only")
	private BigDecimal toRange;

	@Digits(integer = 6, fraction = 3, message = "fromRange valid till 3 decimal places only")
	private BigDecimal toleranceValue;

}
