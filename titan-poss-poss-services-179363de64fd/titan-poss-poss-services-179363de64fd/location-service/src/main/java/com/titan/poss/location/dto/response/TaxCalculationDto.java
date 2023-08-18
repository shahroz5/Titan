/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto.response;

import java.math.BigDecimal;
import java.util.Map;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class TaxCalculationDto {

	private Map<String, BigDecimal> taxDetails;

}
